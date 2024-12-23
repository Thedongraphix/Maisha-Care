'use client';

import DashboardHero from '@/components/dashboard/DashboardHero'
import MedicalRecordTableContainer from '@/components/medical-record-table/medical-record-table-container'
import React from 'react'

const PatientContent = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHero />
      <MedicalRecordTableContainer />
    </div>
  );
}

export default PatientContent;