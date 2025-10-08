import { Locker } from '@/shared/types';
import { LockerCard } from '../locker-card';

interface LockerGridProps {
  lockers: Locker[];
  targetLockerId?: string | number;
  userLocker?: Locker | null;
  onReserve?: (lockerId: number) => void;
  onRelease?: (lockerId: number) => void;
  isReserving?: boolean;
  isReleasing?: boolean;
}

export const LockerGrid = ({
  lockers,
  targetLockerId,
  userLocker,
  onReserve,
  onRelease,
  isReserving = false,
  isReleasing = false,
}: LockerGridProps) => {
  if (lockers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Нет доступных шкафчиков</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {lockers.map(locker => (
        <LockerCard
          key={locker.id}
          locker={locker}
          isHighlighted={String(locker.id) === String(targetLockerId)}
          isUserLocker={userLocker?.id === locker.id}
          onReserve={onReserve}
          onRelease={onRelease}
          isReserving={isReserving}
          isReleasing={isReleasing}
        />
      ))}
    </div>
  );
};
