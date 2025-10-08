import { Locker } from '@/shared/types';
import { Button } from '@/shared/ui';

interface LockerCardProps {
  locker: Locker;
  isHighlighted?: boolean;
  isUserLocker?: boolean;
  onReserve?: (lockerId: number) => void;
  onRelease?: (lockerId: number) => void;
  isReserving?: boolean;
  isReleasing?: boolean;
}

export const LockerCard = ({
  locker,
  isHighlighted = false,
  isUserLocker = false,
  onReserve,
  onRelease,
  isReserving = false,
  isReleasing = false,
}: LockerCardProps) => {
  const isBusy = !!locker.busyBy;
  const isFree = !isBusy;

  const cardClasses = [
    'p-4 border rounded-lg transition-all duration-200',
    isFree ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
    isHighlighted ? 'ring-2 ring-blue-500' : '',
    isUserLocker ? 'bg-blue-50 border-blue-300 shadow-md' : '',
  ].join(' ');

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">#{locker.id}</span>
        <span className="text-sm text-gray-600">
          {isBusy ? `Занят: ${locker.busyBy}` : 'Свободен'}
        </span>
      </div>
      
      {isUserLocker && onRelease && (
        <Button
          variant="danger"
          onClick={() => onRelease(locker.id)}
          disabled={isReleasing}
          className="w-full"
        >
          {isReleasing ? 'Освобождение...' : 'Освободить'}
        </Button>
      )}
      
      {isFree && !isUserLocker && onReserve && (
        <Button
          variant="primary"
          onClick={() => onReserve(locker.id)}
          disabled={isReserving}
          className="w-full"
        >
          {isReserving ? 'Бронирование...' : 'Забронировать'}
        </Button>
      )}
    </div>
  );
};
