import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { tokenProvider } from '@/utils/token-provider';

export function ClerkTokenSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    tokenProvider.setGetToken(() => getToken());
  }, [getToken]);

  return null;
}
