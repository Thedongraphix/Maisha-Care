'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const WaitlistContent = dynamic(
  () => import('./WaitlistContent'),
  { 
    ssr:false
  }
);

export default function WaitlistPage() {
  return <WaitlistContent />;
}