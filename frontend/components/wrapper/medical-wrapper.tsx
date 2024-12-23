import React, { useState } from 'react';
import { ethers } from 'ethers';
import crypto from 'crypto';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import {
  type Address,
  type ContractFunctionParameters,
} from "viem";

import { TEMPORARY_ACCESS_ADDRESS, HEALTH_RECORD_MANAGER_ADDRESS } from "../../constants";
import { TemporaryAccess } from '@/abi/TemporaryAccess';
import { HealthRecordManager } from '@/abi/HealthRecordManager';
import { MedicalFormData } from '@/types/medical';

// Type definitions for encrypted data
interface EncryptedPackage {
  encryptedData: Uint8Array;
  iv: Uint8Array;
  authTag: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  signature: Uint8Array;
}

// Updated encryption utilities with proper typing
const encryptData = async (data: MedicalFormData, symmetricKey: Uint8Array): Promise<{
  iv: Uint8Array;
  encryptedData: Uint8Array;
  authTag: Uint8Array;
}> => {
  // Convert Buffer to Uint8Array for iv
  const iv = new Uint8Array(crypto.randomBytes(12));
  
  // Create cipher with Uint8Array parameters
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(symmetricKey),
    iv
  ) as crypto.CipherGCM;

  const jsonString = JSON.stringify(data);
  
  // Convert string to Uint8Array for encryption
  const inputData = new TextEncoder().encode(jsonString);
  
  // Update and finalize encryption
  const encryptedBuffer = Buffer.concat([
    cipher.update(inputData),
    cipher.final()
  ]);

  // Convert Buffer to Uint8Array for consistency
  const authTag = new Uint8Array(cipher.getAuthTag());
  
  return {
    iv,
    encryptedData: new Uint8Array(encryptedBuffer),
    authTag
  };
};

const decryptData = async (
  encryptedPackage: EncryptedPackage,
  privateKey: string,
  publicKey: string
): Promise<MedicalFormData> => {
  try {
    const pemPrivateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
    const pemPublicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

    // Decrypt symmetric key
    const decryptedSymmetricKey = crypto.privateDecrypt(
      {
        key: pemPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(encryptedPackage.encryptedSymmetricKey)
    );

    // Verify signature
    const verifier = crypto.createVerify('sha256');
    verifier.update(Buffer.from(encryptedPackage.encryptedData));
    const isVerified = verifier.verify(
      pemPublicKey,
      Buffer.from(encryptedPackage.signature)
    );

    if (!isVerified) {
      throw new Error('Signature verification failed');
    }

    // Create decipher
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      decryptedSymmetricKey,
      Buffer.from(encryptedPackage.iv)
    ) as crypto.DecipherGCM;

    // Set auth tag
    decipher.setAuthTag(Buffer.from(encryptedPackage.authTag));

    // Decrypt data
    const decryptedBuffer = Buffer.concat([
      decipher.update(Buffer.from(encryptedPackage.encryptedData)),
      decipher.final()
    ]);

    // Parse decrypted data
    return JSON.parse(decryptedBuffer.toString('utf8'));
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

export default function MedicalRecordWrapper({
  doctorAddress,
  patientAddress,
  formData,
}: {
  doctorAddress: Address;
  patientAddress: Address;
  formData: MedicalFormData;
}) {
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserKeys = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const message = "Please sign this message to access your public key for encryption";
      const signature = await signer.signMessage(message);
      
      const messageHash = ethers.hashMessage(message);
      const signatureBytes = ethers.Signature.from(signature);
      const signingKey = ethers.SigningKey.recoverPublicKey(messageHash, signatureBytes);

      return {
        publicKey: signingKey,
        signer
      };
    } catch (error) {
      console.error('Error getting user keys:', error);
      throw error;
    }
  };

  const prepareEncryptedData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate symmetric key as Uint8Array
      const symmetricKey = new Uint8Array(crypto.randomBytes(32));
      const { publicKey, signer } = await getUserKeys();

      const encryptedResult = await encryptData(formData, symmetricKey);

      // Encrypt symmetric key
      const encryptedSymmetricKey = new Uint8Array(
        crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          Buffer.from(symmetricKey)
        )
      );

      // Sign encrypted data
      const messageToSign = ethers.keccak256(
        ethers.solidityPacked(['bytes'], [encryptedResult.encryptedData])
      );
      const signature = await signer.signMessage(ethers.getBytes(messageToSign));

      return {
        encryptedData: encryptedResult.encryptedData,
        iv: encryptedResult.iv,
        authTag: encryptedResult.authTag,
        encryptedSymmetricKey,
        signature: new Uint8Array(Buffer.from(signature.slice(2), 'hex'))
      };
    } catch (error) {
      console.error('Error preparing encrypted data:', error);
      setError('Failed to encrypt data');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
    setError(err.message);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    if (!accessGranted) {
      setAccessGranted(true);
    }
  };

  const requestAccessContract = {
    address: TEMPORARY_ACCESS_ADDRESS,
    abi: TemporaryAccess,
    functionName: "requestAccess",
    args: [patientAddress],
  } as unknown as ContractFunctionParameters;

  const createMedicalRecordContract = async () => {
    const encryptedPackage = await prepareEncryptedData();
    const dataHash = ethers.keccak256(
      ethers.solidityPacked(['bytes'], [encryptedPackage.encryptedData])
    );

    return {
      address: HEALTH_RECORD_MANAGER_ADDRESS,
      abi: HealthRecordManager,
      functionName: "initiateCurrentHealthUpdate",
      args: [patientAddress, dataHash],
    } as unknown as ContractFunctionParameters;
  };

  return (
    <div className="flex w-[450px] flex-col space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!accessGranted ? (
        <Transaction
          contracts={[requestAccessContract]}
          chainId={84532}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton 
            className="w-full max-w-full text-white bg-blue-500 hover:bg-blue-600 py-2 rounded" 
            text='Request Access'
            disabled={loading} 
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      ) : (
        <MedicalRecordTransaction 
          createContract={createMedicalRecordContract}
          onError={handleError}
          onSuccess={handleSuccess}
          loading={loading}
        />
      )}
    </div>
  );
}

// Separate component to handle async contract creation
const MedicalRecordTransaction = ({
  createContract,
  onError,
  onSuccess,
  loading
}: {
  createContract: () => Promise<ContractFunctionParameters>;
  onError: (error: TransactionError) => void;
  onSuccess: (response: TransactionResponse) => void;
  loading: boolean;
}) => {
  const [contract, setContract] = useState<ContractFunctionParameters | null>(null);

  React.useEffect(() => {
    createContract()
      .then(setContract)
      .catch(error => onError(error as TransactionError));
  }, [createContract, onError]);

  if (!contract) return null;

  return (
    <Transaction
      contracts={[contract]}
      chainId={84532}
      onError={onError}
      onSuccess={onSuccess}
    >
      <TransactionButton 
        className="w-full max-w-full text-white bg-green-500 hover:bg-green-600 py-2 rounded" 
        text='Add Medical Record'
        disabled={loading}
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
};