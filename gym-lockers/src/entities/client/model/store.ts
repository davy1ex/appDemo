import { create } from 'zustand';
import { Client, ClientState } from '@/shared/types';

interface ClientStore extends ClientState {
  // Actions
  setClients: (clients: Client[]) => void;
  setSelectedClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
};

export const useClientStore = create<ClientStore>((set) => ({
  ...initialState,

  setClients: (clients) => set({ clients }),
  
  setSelectedClient: (selectedClient) => set({ selectedClient }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}));
