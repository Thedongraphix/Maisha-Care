declare module '@privy-io/react-auth' {
  import { ReactNode } from 'react';

  export interface PrivyClientConfig {
    loginMethods: readonly string[] | string[];
    appearance: {
      theme: 'light' | 'dark';
      accentColor: string;
      showWalletLoginFirst: boolean;
    };
    defaultChain: string;
  }

  export interface PrivyProviderProps {
    appId: string;
    onSuccess?: () => void;
    config: PrivyClientConfig;
    children: ReactNode;
  }

  export interface User {
    id: string;
    phoneNumber?: string;
  }

  export interface PrivyInterface {
    ready: boolean;
    authenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
  }

  export function PrivyProvider(props: PrivyProviderProps): JSX.Element;
  export function usePrivy(): PrivyInterface;
} 