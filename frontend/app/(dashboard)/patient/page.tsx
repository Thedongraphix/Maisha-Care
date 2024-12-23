'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const PatientContent = dynamic(
  () => import('./PatientContent'),
  { 
    ssr: false
  }
);

export default function PatientPage() {
  return <PatientContent />;
}