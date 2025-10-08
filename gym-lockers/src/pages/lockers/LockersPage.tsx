import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/entities/user/model/hooks";
import { useLockerStore } from "@/entities/locker/model/store";
import { useLockerActions } from "@/entities/locker/model/hooks";
import { LockerToolbar } from "@/widgets/locker-toolbar";
import { LockerGrid } from "@/widgets/locker-grid";
import { Button, Card } from "@/shared/ui";

export const LockersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, profile } = useAuth();
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  const { selectedSex, lockers, userLocker, loading, error } = useLockerStore();
  const { loadLockers, reserveLocker, releaseLocker } = useLockerActions();

  const targetLockerId = useMemo(
    () => new URLSearchParams(location.search).get("locker"), 
    [location.search]
  );

  // Use the selected client's name or profile name
  const userName = selectedClient?.name || profile?.name || "Anon";

  // Load lockers when sex or userName changes
  useEffect(() => {
    if (token) {
      loadLockers(token, userName);
    }
  }, [token, userName, selectedSex, loadLockers]);

  const handleSexChange = (newSex: 'male' | 'female') => {
    useLockerStore.getState().setSelectedSex(newSex);
    setSelectedClient(null);
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
  };

  const handleReserve = async (lockerId: number) => {
    if (isReserving || !token) return;
    
    setIsReserving(true);
    useLockerStore.getState().setError(null);
    
    try {
      await reserveLocker(token, lockerId, userName);
      setSelectedClient(null);
    } catch (err) {
      console.error('Reservation failed:', err);
    } finally {
      setIsReserving(false);
    }
  };

  const handleRelease = async (lockerId: number) => {
    if (isReleasing || !token) return;
    
    setIsReleasing(true);
    useLockerStore.getState().setError(null);
    
    try {
      await releaseLocker(token, lockerId, userName);
    } catch (err) {
      console.error('Release failed:', err);
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-3">
        <Button variant="secondary" onClick={() => navigate('/')}>Перейти на главный (QR)</Button>
      </div>
      <LockerToolbar
        sex={selectedSex}
        onSexChange={handleSexChange}
        onClientSelect={handleClientSelect}
        selectedClient={selectedClient}
      />

      {userLocker && (
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-1">Ваш шкафчик</h3>
            <p className="text-blue-600">У вас забронирован шкафчик #{userLocker.id}</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="mb-4 bg-red-50 border-red-200">
          <div className="text-red-600">{error}</div>
        </Card>
      )}
      
      {loading ? (
        <Card>
          <div className="text-center py-8 text-gray-500">Загрузка...</div>
        </Card>
      ) : (
        <LockerGrid
          lockers={lockers}
          targetLockerId={targetLockerId}
          onReserve={handleReserve}
          onRelease={handleRelease}
          isReserving={isReserving}
          isReleasing={isReleasing}
          userLocker={userLocker}
        />
      )}
    </div>
  );
};
