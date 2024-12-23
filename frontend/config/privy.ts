export const PRIVY_CONFIG = {
  loginMethods: ['google'] as const,
  appearance: {
    theme: 'light' as const,
    accentColor: '#3B82F6',
    showWalletLoginFirst: false,
  },
  defaultChain: 'lisksepolia',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  supportedWallets: ['metamask'] as const
};

// Create a mutable version of the config
export const getMutablePrivyConfig = () => ({
  ...PRIVY_CONFIG,
  loginMethods: [...PRIVY_CONFIG.loginMethods],
}); 