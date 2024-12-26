'use client';

import { PrivyProvider, PrivyClientConfig } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import { WagmiProvider } from 'wagmi';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { liskSepolia } from 'viem/chains';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not defined');
}

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  loginMethods: ['google'] as const,
  appearance: {
    theme: 'light',
    accentColor: '#3B82F6',
    showWalletLoginFirst: false
  },
  defaultChain: liskSepolia,
  supportedChains: [liskSepolia]
};

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID as string}
      config={privyConfig}
      onSuccess={handleLogin}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
} 