// import { useState, useCallback } from 'react';
// import crypto from 'crypto';

// // Types
// type MedicalCondition = {
//   condition: string;
//   diagnosedDate: string;
// };

// type Medication = {
//   name: string;
//   dosage: string;
//   frequency: string;
// };

// type PatientData = {
//   patientId: string;
//   name: string;
//   dateOfBirth: string;
//   gender: string;
//   medicalHistory: MedicalCondition[];
//   currentMedications: Medication[];
//   lastCheckup: string;
// };

// type EncryptedResult = {
//   iv: Buffer;
//   encryptedData: Buffer;
//   authTag: Buffer;
// };

// type StoredData = {
//   encryptedData: Buffer;
//   iv: Buffer;
//   authTag: Buffer;
//   encryptedSymmetricKey: Buffer;
//   signature: Buffer;
// };

// type KeyPair = {
//   publicKey: crypto.KeyObject;
//   privateKey: crypto.KeyObject;
// };

// // Hook
// const useEncryptedData = () => {
//   const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
//   const [symmetricKey, setSymmetricKey] = useState<Buffer | null>(null);
//   const [encryptedData, setEncryptedData] = useState<StoredData | null>(null);

//   const generateKeyPair = useCallback(() => {
//     const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//       modulusLength: 2048,
//     });
//     setKeyPair({ publicKey, privateKey });
//   }, []);

//   const generateSymmetricKey = useCallback(() => {
//     const key = crypto.randomBytes(32);
//     setSymmetricKey(key);
//     return key;
//   }, []);

//   const encryptData = useCallback((data: PatientData, symmetricKey: Buffer): EncryptedResult => {
//     const iv = crypto.randomBytes(12);
//     const cipher = crypto.createCipheriv('aes-256-gcm', symmetricKey, iv);

//     let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
//     encrypted += cipher.final('hex');

//     const authTag = cipher.getAuthTag();

//     return {
//       iv,
//       encryptedData: Buffer.from(encrypted, 'hex'),
//       authTag
//     };
//   }, []);

//   const encryptAndStoreData = useCallback((data: PatientData) => {
//     if (!keyPair) {
//       throw new Error('Key pair not generated');
//     }

//     const symKey = generateSymmetricKey();
//     const encryptedResult = encryptData(data, symKey);

//     const encryptedSymmetricKey = crypto.publicEncrypt(
//       keyPair.publicKey,
//       symKey
//     );

//     const signer = crypto.createSign('sha256');
//     signer.update(encryptedResult.encryptedData);
//     signer.end();

//     const signature = signer.sign(keyPair.privateKey);

//     const storedData: StoredData = {
//       encryptedData: encryptedResult.encryptedData,
//       iv: encryptedResult.iv,
//       authTag: encryptedResult.authTag,
//       encryptedSymmetricKey,
//       signature
//     };

//     setEncryptedData(storedData);
//   }, [keyPair, generateSymmetricKey, encryptData]);

//   const decryptData = useCallback((storedData: StoredData): PatientData | null => {
//     if (!keyPair) {
//       throw new Error('Key pair not generated');
//     }

//     try {
//       const decryptedSymmetricKey = crypto.privateDecrypt(
//         keyPair.privateKey,
//         storedData.encryptedSymmetricKey
//       );

//       const verifier = crypto.createVerify('sha256');
//       verifier.update(storedData.encryptedData);
//       verifier.end();

//       const isVerified = verifier.verify(keyPair.publicKey, storedData.signature);

//       if (!isVerified) {
//         throw new Error('Signature verification failed');
//       }

//       const decipher = crypto.createDecipheriv(
//         'aes-256-gcm',
//         decryptedSymmetricKey,
//         storedData.iv
//       );
//       decipher.setAuthTag(storedData.authTag);

//       let decrypted = decipher.update(storedData.encryptedData, null, 'utf8');
//       decrypted += decipher.final('utf8');

//       return JSON.parse(decrypted) as PatientData;
//     } catch (error) {
//       console.error("Decryption or Verification Failed:", error);
//       return null;
//     }
//   }, [keyPair]);

//   return {
//     generateKeyPair,
//     encryptAndStoreData,
//     decryptData,
//     encryptedData,
//   };
// };

// export default useEncryptedData;