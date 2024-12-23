'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DoctorContent = dynamic(
  () => import('./DoctorContent'),
  { ssr: false }
);

export default function DoctorPage() {
  return <DoctorContent />;
}