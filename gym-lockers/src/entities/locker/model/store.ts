import { create } from 'zustand';
import { Locker, LockerState } from '@/shared/types';

interface LockerStore extends LockerState {
  // Actions
  setLockers: (lockers: Locker[]) => void;
  setUserLocker: (locker: Locker | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedSex: (sex: 'male' | 'female') => void;
  updateLocker: (locker: Locker) => void;
  reset: () => void;
}

const initialState: LockerState = {
  lockers: [],
  userLocker: null,
  loading: false,
  error: null,
  selectedSex: 'male',
};

export const useLockerStore = create<LockerStore>((set, get) => ({
  ...initialState,

  setLockers: (lockers) => set({ lockers }),
  
  setUserLocker: (userLocker) => set({ userLocker }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setSelectedSex: (selectedSex) => set({ selectedSex }),
  
  updateLocker: (updatedLocker) => set((state) => ({
    lockers: state.lockers.map(locker => 
      locker.id === updatedLocker.id ? updatedLocker : locker
    ),
    userLocker: state.userLocker?.id === updatedLocker.id ? updatedLocker : state.userLocker,
  })),
  
  reset: () => set(initialState),
}));
