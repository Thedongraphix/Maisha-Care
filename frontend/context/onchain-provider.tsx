<<<<<<< HEAD:client/context/onchain-provider.tsx
// 'use client';
// import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import type { ReactNode } from 'react';
// import { base } from 'viem/chains';
// import * as dotenv from "dotenv";
// import { WagmiProvider } from 'wagmi';
// import { useWagmiConfig } from '@/config/wagmi';


// dotenv.config();
// type Props = { children: ReactNode };

// const queryClient = new QueryClient();
// const { NEXT_PUBLIC_ONCHAINKIT_API_KEY } = process.env;

// function OnchainProviders({ children }: Props) {
//   const wagmiConfig = useWagmiConfig();

//   return (
//     <WagmiProvider config={wagmiConfig}>
//       <QueryClientProvider client={queryClient}>
//         <OnchainKitProvider apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
//           <RainbowKitProvider modalSize="compact">
//             {children}
//           </RainbowKitProvider>
//         </OnchainKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

// export default OnchainProviders;
=======
'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { base } from 'viem/chains';
import * as dotenv from "dotenv";
import { WagmiProvider } from 'wagmi';
import { useWagmiConfig } from '@/config/wagmi';


dotenv.config();
type Props = { children: ReactNode };

const queryClient = new QueryClient();
const { NEXT_PUBLIC_ONCHAINKIT_API_KEY } = process.env;

function OnchainProviders({ children }: Props) {
  const wagmiConfig = useWagmiConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
>>>>>>> f5e3ccd26b17d0597fa74561724a9f25c9dc1a3f:frontend/context/onchain-provider.tsx
