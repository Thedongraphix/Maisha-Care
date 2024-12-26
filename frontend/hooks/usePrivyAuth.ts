import { usePrivy, User } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function usePrivyAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  return {
    isLoading: !ready,
    isAuthenticated: authenticated,
    user,
    login,
    logout,
  };
} 