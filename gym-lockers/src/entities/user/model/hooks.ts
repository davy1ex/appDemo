import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../model/store';
import { AuthApiService } from '../api/authApi';
import { TelegramInitData } from '@/shared/types';

// Helper function to get Telegram init data
function getTgInitData(): TelegramInitData {
  const w = window;
  const wa = w?.Telegram?.WebApp;
  const initDataRaw = wa?.initData || "";
  const user = wa?.initDataUnsafe?.user || null;
  return { initDataRaw, user };
}

export const useAuthActions = () => {
  const {
    setToken,
    setProfile,
    setLoading,
    setError,
    login,
    logout,
  } = useAuthStore();

  const authenticateWithTelegram = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { initDataRaw, user } = getTgInitData();
      
      // Initialize Telegram WebApp
      window.Telegram?.WebApp?.ready?.();
      
      // Dev fallback: if not in Telegram, use mock mode
      if (!initDataRaw) {
        const mockToken = "dev-mock-token";
        const mockProfile = { id: 1, name: "Dev" };
        login(mockToken, mockProfile);
        return;
      }

      const response = await AuthApiService.authenticateWithTelegram(initDataRaw, user?.id);
      login(response.token, response.profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, login]);

  const registerFromTelegram = useCallback(async (token: string, sex: 'male' | 'female') => {
    setError(null);
    try {
      const response = await AuthApiService.registerFromTelegram(token, sex);
      setProfile(response.profile);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  }, [setProfile, setError]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    authenticateWithTelegram,
    registerFromTelegram,
    logout: handleLogout,
  };
};

export const useAuth = () => {
  const store = useAuthStore();
  const actions = useAuthActions();

  // Auto-authenticate on mount
  useEffect(() => {
    if (!store.token && !store.loading) {
      actions.authenticateWithTelegram();
    }
  }, [store.token, store.loading, actions]);

  return {
    ...store,
    ...actions,
  };
};
