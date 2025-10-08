import { useCallback } from 'react';
import { useLockerStore } from '../model/store';
import { LockerMockApiService } from '../api/lockerMockApi';

export const useLockerActions = () => {
  const {
    setLockers,
    setUserLocker,
    setLoading,
    setError,
    updateLocker,
    selectedSex,
  } = useLockerStore();

  const loadLockers = useCallback(async (token: string, userName?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [lockersData, userLockerData] = await Promise.all([
        LockerMockApiService.getLockers(token, selectedSex),
        userName ? LockerMockApiService.getUserLocker(token, userName) : Promise.resolve(null)
      ]);
      
      setLockers(lockersData);
      setUserLocker(userLockerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lockers');
    } finally {
      setLoading(false);
    }
  }, [selectedSex, setLockers, setUserLocker, setLoading, setError]);

  const reserveLocker = useCallback(async (token: string, lockerId: number, userName: string) => {
    setError(null);
    try {
      const updatedLocker = await LockerMockApiService.reserveLocker(token, lockerId, userName);
      updateLocker(updatedLocker);
      setUserLocker(updatedLocker);
      return updatedLocker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reserve locker';
      setError(errorMessage);
      throw err;
    }
  }, [updateLocker, setUserLocker, setError]);

  const releaseLocker = useCallback(async (token: string, lockerId: number, userName: string) => {
    setError(null);
    try {
      const updatedLocker = await LockerMockApiService.releaseLocker(token, lockerId, userName);
      updateLocker(updatedLocker);
      setUserLocker(null);
      return updatedLocker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to release locker';
      setError(errorMessage);
      throw err;
    }
  }, [updateLocker, setUserLocker, setError]);

  const finishTraining = useCallback(async (token: string) => {
    setError(null);
    try {
      const result = await LockerMockApiService.finishTraining(token);
      setUserLocker(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to finish training';
      setError(errorMessage);
      throw err;
    }
  }, [setUserLocker, setError]);

  return {
    loadLockers,
    reserveLocker,
    releaseLocker,
    finishTraining,
  };
};
