import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/features/qr-scan";
import { Button, Card } from "@/shared/ui";

export const QRScanPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleScan = useCallback(async (lockerId: string) => {
    setError("");
    setVerifying(true);
    try {
      // TODO: replace with real verification request
      await new Promise(r => setTimeout(r, 300));
      navigate(`/lockers?locker=${lockerId}`, { replace: true });
    } catch (e: any) {
      setError(e?.message || "Ошибка подтверждения QR-кода");
    } finally {
      setVerifying(false);
    }
  }, [navigate]);

  const handleError = useCallback((err: Error) => {
    setError(err.message || "Ошибка сканирования");
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-center">Сканирование QR-кода</h2>
        <p className="text-gray-600 mb-6 text-center">
          Наведите камеру на QR-код шкафчика для быстрого доступа
        </p>
        
        <QRScanner 
          onScan={handleScan}
          onError={handleError}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}
        
        <div className="mt-6 text-center space-y-2">
          <Button 
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Вернуться к списку
          </Button>
          {verifying && (
            <div className="text-sm text-gray-500">Проверка...</div>
          )}
        </div>
      </Card>
    </div>
  );
};
