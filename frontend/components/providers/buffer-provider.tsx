'use client';

import { useEffect } from 'react';
import { initializeBuffer } from '@/utils/buffer';

export default function BufferProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeBuffer();
  }, []);

  return <>{children}</>;
}