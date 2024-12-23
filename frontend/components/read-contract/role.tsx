'use client'

import React, { useState, useEffect } from 'react';
import { createPublicClient, http, Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { RoleManager } from '@/abi/RoleManager';
import { VerifiedAddressRegistry } from '@/abi/VerifiedAddressRegistry';
import { ROLE_MANAGER_ADDRESS } from '@/constants';
import { ethers } from 'ethers';

// Create a public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

type ContractDataReaderProps = {
  userAddress: Address;
};

export default function ContractDataReader({ userAddress }: ContractDataReaderProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const patient = ethers.keccak256('patient');
  const doctor = ethers.keccak256('doctor');

  useEffect(() => {
    async function fetchUserRole() {
      setIsLoading(true);
      setError(null);
      try {
        const hasPatientRole = await publicClient.readContract({
          address: ROLE_MANAGER_ADDRESS,
          abi: RoleManager,
          functionName: 'hasRole',
          args: [patient, userAddress],
        });

        const hasDoctorRole = await publicClient.readContract({
          address: ROLE_MANAGER_ADDRESS,
          abi: RoleManager,
          functionName: 'hasRole',
          args: [doctor, userAddress],
        });

        if (hasPatientRole) {
          setUserRole('Patient');
        } else if (hasDoctorRole) {
          setUserRole('Doctor');
        } else {
          setUserRole('Unknown');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError('Failed to fetch user role. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    if (userAddress) {
      fetchUserRole();
    }
  }, [userAddress]);

  if (isLoading) {
    return <div>Loading user role...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2>User Role: {userRole}</h2>
      {/* You can add more contract data here */}
    </div>
  );
}