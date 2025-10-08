import { useState } from "react";
import { useAuth } from "@/entities/user/model/hooks";
import { useLockerActions } from "@/entities/locker/model/hooks";
import { Button, Card } from "@/shared/ui";

export const TrainingPage = () => {
  const { token, profile } = useAuth();
  const { finishTraining } = useLockerActions();
  
  const [isFinishing, setIsFinishing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFinishTraining = async () => {
    if (isFinishing || !token) return;
    
    setIsFinishing(true);
    setError('');
    setStatus('');

    try {
      const result = await finishTraining(token);
      if (result.ok) {
        setStatus('Тренировка успешно завершена');
        setError('');
      } else {
        throw new Error('Не удалось завершить тренировку');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при завершении тренировки');
      setStatus('');
    } finally {
      setIsFinishing(false);
    }
  };

  const clearStatus = () => {
    setStatus('');
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-center">Завершение тренировки</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Нажмите кнопку ниже, чтобы завершить тренировку и освободить все забронированные шкафчики.
          </p>
          {profile && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                Пользователь: <strong>{profile.name || 'Неизвестно'}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button 
            variant="primary"
            onClick={handleFinishTraining}
            disabled={isFinishing}
            className="w-full"
          >
            {isFinishing ? 'Завершение...' : 'Завершить тренировку'}
          </Button>
          
          {(status || error) && (
            <Button 
              variant="secondary"
              onClick={clearStatus}
              className="w-full"
            >
              Очистить
            </Button>
          )}
        </div>

        {status && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-600">
            {status}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}
      </Card>
    </div>
  );
};
