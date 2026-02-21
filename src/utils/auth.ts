interface GetTokenOptions {
  skipCache?: boolean;
}

interface ClerkSession {
  getToken: (opts?: GetTokenOptions) => Promise<string>;
}

interface ClerkInstance {
  session?: ClerkSession;
}

declare global {
  interface Window {
    Clerk?: ClerkInstance;
  }
}

export const getAuthToken = async (opts: GetTokenOptions = {}): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.Clerk?.session) {
      return await window.Clerk.session.getToken(opts);
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }
  return null;
};

export const getFreshAuthToken = (): Promise<string | null> => getAuthToken({ skipCache: true });
