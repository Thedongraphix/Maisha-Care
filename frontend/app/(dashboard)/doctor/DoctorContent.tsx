"use client";

import { verifyABI } from "@/abi/verify-abi";
import DashboardAdmin from "@/components/dashboard/DashboardAdmin";
import PatientTableContainer from "@/components/patient-table/patient-table-container";
import React from "react";
import { useReadContract } from "wagmi";

interface ContractConfig {
  abi: typeof verifyABI;
  address: `0x${string}`;
  functionName: "isVerified";
  args: [string, string];
}

const DoctorContent = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Using React.useCallback for the read contract configuration
  const readConfig = React.useMemo<ContractConfig>(() => ({
    abi: verifyABI,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "isVerified",
    args: [
      "0xec03945fa2196716a09674e2cd6a57153479ecb05ea91e189e2688f793ab5381",
      "0xBd41795def27c74870364e2e1Ed9aC7A4166A68A",
    ],
  }), []); // Empty dependency array since values don't change

  const { data, isError, isLoading } = mounted ? useReadContract(readConfig) : 
    { data: undefined, isError: false, isLoading: true };

  // Add error handling
  React.useEffect(() => {
    if (isError) {
      console.error("Error reading contract:", isError);
      // Add your error handling logic here
    }
  }, [isError]);

  // Add loading state UI
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading contract data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardAdmin />
      <PatientTableContainer />
    </div>
  );
};

export default DoctorContent;