import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (lockerId: string) => void;
  onError?: (error: Error) => void;
}

export const QRScanner = ({ onScan, onError }: QRScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerIdRef = useRef<string>(`qr-scanner-${crypto.randomUUID()}`);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const handleScan = useCallback((text: string) => {
    try {
      const url = new URL(text, window.location.origin);
      if (url.pathname === "/open" && url.searchParams.get("locker")) {
        onScan(url.searchParams.get("locker")!);
      }
    } catch (err) {
      console.warn("Invalid QR code:", err);
    }
  }, [onScan]);

  const handleError = useCallback((err: any) => {
    console.error("QR Scanner error:", err);
    setError(err.message || "Ошибка сканирования");
    onError?.(err);
  }, [onError]);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(containerIdRef.current);
    scannerRef.current = html5QrCode;
    let isMounted = true;

    const startScanning = async () => {
      try {
        setIsScanning(true);
        setError("");

        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        const cameraId = devices?.[0]?.id;
        const scanConfig = { fps: 10, qrbox: 250 } as const;

        if (cameraId) {
          // Start using the specific camera id
          await html5QrCode.start(
            cameraId,
            scanConfig,
            handleScan,
            handleError
          );
        } else {
          // Fallback to environment facing mode if no device list
          await html5QrCode.start(
            { facingMode: "environment" },
            scanConfig,
            handleScan,
            handleError
          );
        }
      } catch (err) {
        if (isMounted) {
          handleError(err);
        }
      }
    };

    startScanning();

    return () => {
      isMounted = false;
      html5QrCode.stop()
        .catch(() => {})
        .finally(() => html5QrCode.clear());
    };
  }, [handleScan, handleError]);

  return (
    <div className="text-center">
      <div 
        id={containerIdRef.current}
        className="mx-auto border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ width: 320, height: 240 }} 
      />
      {isScanning && !error && (
        <div className="mt-2 text-gray-600 italic">
          Наведите камеру на QR-код
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};
