"use client";

import { useRouter } from 'next/navigation';
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
  encodePacked,
  keccak256,
  type Address,
  type ContractFunctionParameters,
} from "viem";
import { VerifiedAddressRegistry } from "../../abi/VerifiedAddressRegistry";
import { VERIFIED_ADDRESS_REGISTRY_ADDRESS, ROLE_MANAGER_ADDRESS } from "../../constants";
import { RoleManager } from "@/abi/RoleManager";

export type FormData = {
  name: string;
  dateOfBirth: string;
  nationalID: string;
};

export default function SignUpWrapper({
  address,
  role,
  formData,
}: {
  address: Address;
  role: string;
  formData: FormData;
}) {
  const router = useRouter();

  const roleHashes = {
    patient: keccak256(encodePacked(["string"], ["patient"])),
    doctor: keccak256(encodePacked(["string"], ["doctor"])),
    researcher: keccak256(encodePacked(["string"], ["researcher"])),
    builder: keccak256(encodePacked(["string"], ["builder"])),
  };

  const roleHash = roleHashes[role.toLowerCase() as keyof typeof roleHashes];
  if (!roleHash) {
    throw new Error("Invalid role");
  }

  const contracts = [
    {
      address: VERIFIED_ADDRESS_REGISTRY_ADDRESS,
      abi: VerifiedAddressRegistry,
      functionName: "verifyAddress",
      args: [roleHash, address],
    },
    {
      address: ROLE_MANAGER_ADDRESS,
      abi: RoleManager,
      functionName: role === 'doctor' ? "registerAsDoctor" : "registerAsPatient",
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
    // You might want to show an error message to the user here
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    // Route based on the user's role
    switch (role.toLowerCase()) {
      case 'patient':
        router.push('/patient');
        break;
      case 'doctor':
        router.push('/doctor');
        break;
      case 'researcher':
        router.push('/researcher');
        break;
      case 'builder':
        router.push('/builder');
        break;
      default:
        console.error('Unknown role:', role);
        // You might want to redirect to a default page or show an error
    }
  };

  return (
    <div className="flex w-[450px] bg-blue-600">
      <Transaction
        contracts={contracts}
        className="w-[450px]"
        chainId={84532}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]" text='Create Account' />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}