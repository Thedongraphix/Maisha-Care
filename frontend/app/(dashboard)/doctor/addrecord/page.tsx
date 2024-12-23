'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AddMedicalRecordContent = dynamic(
  () => import('./AddMedicalRecordContent'),
  { ssr: false }
);

export default function AddMedicalRecordPage() {
  return <AddMedicalRecordContent />;
}