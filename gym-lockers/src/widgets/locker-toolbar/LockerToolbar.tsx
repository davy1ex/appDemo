import { ClientSearch } from '@/features/client-search';

interface LockerToolbarProps {
  sex: 'male' | 'female';
  onSexChange: (sex: 'male' | 'female') => void;
  onClientSelect: (client: any) => void;
  selectedClient?: any;
}

export const LockerToolbar = ({
  sex,
  onSexChange,
  onClientSelect,
  selectedClient,
}: LockerToolbarProps) => {
  return (
    <div className="tma-toolbar">
      <div className="tma-container flex flex-col sm:flex-row gap-3 py-2">
      <select
        value={sex}
        onChange={(e) => onSexChange(e.target.value as 'male' | 'female')}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="male">Мужская</option>
        <option value="female">Женская</option>
      </select>
      
      <ClientSearch
        onClientSelect={onClientSelect}
        selectedClient={selectedClient}
      />
      </div>
    </div>
  );
};
