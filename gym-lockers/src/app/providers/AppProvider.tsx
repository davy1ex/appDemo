import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};
