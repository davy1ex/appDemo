import { useState, useEffect } from 'react';
import { useClientStore } from '@/entities/client/model/store';
import { useClientActions } from '@/entities/client/model/hooks';

interface ClientSearchProps {
  onClientSelect: (client: any) => void;
  selectedClient?: any;
}

export const ClientSearch = ({ onClientSelect, selectedClient }: ClientSearchProps) => {
  const [query, setQuery] = useState('');
  const { clients, loading } = useClientStore();
  const { searchClients, selectClient } = useClientActions();

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchClients(query);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query, searchClients]);

  const handleClientClick = (client: any) => {
    selectClient(client);
    onClientSelect(client);
    setQuery(`${client.name} · ${client.phone}`);
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Поиск клиента: телефон или имя"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          Поиск...
        </div>
      )}
      
      {clients.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
          {clients.map(client => (
            <div
              key={client.id}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedClient?.id === client.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleClientClick(client)}
            >
              {client.name} · {client.phone}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
