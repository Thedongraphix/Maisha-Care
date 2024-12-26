'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children?: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  return (
    <div>
      {children}
      <button
        onClick={() => login()}
        disabled={!ready || authenticated}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          ready && !authenticated
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
      >
        Sign in with Google
      </button>
    </div>
  );
} 