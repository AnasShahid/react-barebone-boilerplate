import { useState, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'auth_state';

interface Credentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedAuth
      ? (JSON.parse(storedAuth) as AuthState)
      : { isAuthenticated: false, user: null, token: null };
  });

  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          if (
            credentials.email === 'test@example.com' &&
            credentials.password === 'password'
          ) {
            resolve({
              user: { id: '1', email: credentials.email, name: 'Test User' },
              token: 'fake_jwt_token',
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });

      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: response.user,
        token: response.token,
      };

      setAuthState(newAuthState);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    logout,
    isLoading,
    error,
  };
}
