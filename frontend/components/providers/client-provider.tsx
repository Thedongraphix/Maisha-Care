'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {WagmiProvider} from '@privy-io/wagmi';
import {ThemeProvider} from "next-themes";
import {wagmiConfig} from './privy-provider';
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function ClientProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}