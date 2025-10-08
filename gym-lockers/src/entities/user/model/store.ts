import { create } from 'zustand';
import { AuthState, User, TelegramInitData } from '@/shared/types';

interface AuthStore extends AuthState {
  // Actions
  setToken: (token: string | null) => void;
  setProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (token: string, profile: User) => void;
  logout: () => void;
  reset: () => void;
}

const initialState: AuthState = {
  token: null,
  profile: null,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setToken: (token) => set({ token }),
  
  setProfile: (profile) => set({ profile }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  login: (token, profile) => set({ token, profile, error: null }),
  
  logout: () => set({ token: null, profile: null, error: null }),
  
  reset: () => set(initialState),
}));
