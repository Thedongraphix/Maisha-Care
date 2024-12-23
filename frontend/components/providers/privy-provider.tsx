'use client';

import type {PrivyClientConfig} from '@privy-io/react-auth';
import {PrivyProvider} from '@privy-io/react-auth';
import {http} from 'viem';
import {mainnet,sepolia,} from 'viem/chains';
import {createConfig} from '@privy-io/wagmi';
import ClientProviders from './client-provider';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ['wallet', 'email', 'sms', 'google', ],
  appearance: {
    showWalletLoginFirst: true,
  },
};

export default function PrivyProviderContainer({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={privyConfig}
    >
      <ClientProviders>
        {children}
      </ClientProviders>
    </PrivyProvider>
  );
}