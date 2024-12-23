// src/hooks/useSignUp.ts

import { useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { keccak256, encodePacked } from "viem";


import { VerifiedAddressRegistry } from "@/abi/VerifiedAddressRegistry";
import { RoleManager } from "@/abi/RoleManager";
import { ROLE_MANAGER_ADDRESS, VERIFIED_ADDRESS_REGISTRY_ADDRESS } from "@/constants";
import { log } from "console";

// Define the role hashes
const roleHashes = {
  patient: keccak256(encodePacked(["string"], ["patient"])),
  doctor: keccak256(encodePacked(["string"], ["doctor"])),
  researcher: keccak256(encodePacked(["string"], ["researcher"])),
  builder: keccak256(encodePacked(["string"], ["builder"])),
};

// Define types
export type FormData = {
  name: string;
  dateOfBirth: string;
  nationalID: string;
};

export type SignUpData = {
  role: string;
  address: string;
  formData: FormData;
};

export function useSignUp() {
  const [error, setError] = useState<string | null>(null);

  // Contract write hook for verifyAddress
  const {  data: hash, writeContract } = useWriteContract();

  const { data: isVerifiedData, refetch: refetchIsVerified } = useReadContract({
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    abi: VerifiedAddressRegistry,
    functionName: 'isVerified',
    args: ["0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381", "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A"] 
  });

  console.log("verifiedData:", isVerifiedData)

  const { data, isError, isLoading } = useReadContract({
    abi: VerifiedAddressRegistry,
    address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
    functionName: 'isVerified',
    args: ["0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381", "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A"] 
  })

  console.log("data", data, isError, isLoading);

  const signUp = async (data: SignUpData) => {
    try {
      setError(null);

      // Step 1: Validate role and generate hashes
      const roleHash = roleHashes[data.role.toLowerCase() as keyof typeof roleHashes];
      if (!roleHash) {
        throw new Error('Invalid role');
      }

      const uniqueHash = keccak256(
        encodePacked(
          ["string", "address", "string", "uint256"],
          [data.role, data.address as `0x${string}`, JSON.stringify(data.formData), BigInt(Date.now())]
        )
      );

      // Step 2: Call verifyAddress function
      try {
        console.log("roleHash:",roleHash, "data.address:",data.address, "uniqueHash:",uniqueHash);
        
        writeContract({
          abi: VerifiedAddressRegistry,
          address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
          functionName: 'verifyAddress',
          args: [roleHash, data.address, uniqueHash],
        });


        console.log("Hash:", hash);
        

      } catch (verifyError) {
        throw new Error(`Failed to verify address: ${(verifyError as Error).message}`);
      }

      // Step 3: Check verification status
      try {
        await refetchIsVerified();
        if (!isVerifiedData) {
          throw new Error('Address verification failed');
        }
      } catch (checkError) {
        throw new Error(`Failed to check verification status: ${(checkError as Error).message}`);
      }

      // Step 4: Grant role based on user's role
      try {
        if (data.role.toLowerCase() === 'doctor') {
          writeContract({
            abi: RoleManager,
            address: ROLE_MANAGER_ADDRESS,
            functionName: 'registerAsDoctor',
          });
        } else if (data.role.toLowerCase() === 'patient') {
          await writeContract({
            abi: RoleManager,
            address: ROLE_MANAGER_ADDRESS,
            functionName: 'registerAsPatient',
          });
        } else {
          throw new Error('Unsupported role');
        }
      } catch (roleError) {
        throw new Error(`Failed to grant role: ${(roleError as Error).message}`);
      }

      return {
        success: true,
        message: 'User registered and role granted successfully',
        roleHash,
        uniqueHash,
      };
    } catch (error) {
      setError((error as Error).message);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  };

  return { signUp, error };
}