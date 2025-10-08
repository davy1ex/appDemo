import { useCallback } from 'react';
import { useClientStore } from '../model/store';

// Mock client data
const mockClients = [
  { id: 1, phone: "123456", name: "Ivan", sex: "male" as const },
  { id: 2, phone: "789012", name: "Anna", sex: "female" as const },
  { id: 3, phone: "345678", name: "Petr", sex: "male" as const },
];

export const useClientActions = () => {
  const {
    setClients,
    setSelectedClient,
    setLoading,
    setError,
  } = useClientStore();

  const searchClients = useCallback(async (query: string) => {
    if (!query.trim()) {
      setClients([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const filteredClients = mockClients.filter(client => 
        client.phone.includes(query) || 
        client.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setClients(filteredClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [setClients, setLoading, setError]);

  const selectClient = useCallback((client: any) => {
    setSelectedClient(client);
  }, [setSelectedClient]);

  const clearSelection = useCallback(() => {
    setSelectedClient(null);
  }, [setSelectedClient]);

  return {
    searchClients,
    selectClient,
    clearSelection,
  };
};
