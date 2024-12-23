import { baseSepolia } from '@reown/appkit/networks'

export const REOWN_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  metadata: {
    name: 'MaishaCare',
    description: 'Healthcare Web3 Platform',
    url: 'https://maishacare.com',
    icons: ['https://maishacare.com/icon.png']
  },
  networks: [baseSepolia],
  features: {
    analytics: true,
  }
} as const 