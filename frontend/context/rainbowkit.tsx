"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { anvil } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { State } from "wagmi";

const config = getDefaultConfig({
  appName: "MaishaCare",
  projectId: "c8436beef219805413045a6052e6d04a",
  chains: [anvil],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [anvil.id]: http('http://127.0.0.1:8545'), 
  },
});

const queryClient = new QueryClient();

const RainbowKitContainer = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitContainer;
