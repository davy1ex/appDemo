// src/pages/QRScan.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function QRScanPage() {
  const divId = useRef(`qr-${crypto.randomUUID()}`);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const onScan = useCallback((text) => {
    try {
      const url = new URL(text, window.location.origin);
      if (url.pathname === "/open" && url.searchParams.get("locker")) {
        nav(`/?locker=${url.searchParams.get("locker")}`, { replace: true });
      }
    } catch {}
  }, [nav]);

  useEffect(() => {
    const camConfig = { fps: 10, qrbox: 250 };
    const html5QrCode = new Html5Qrcode(divId.current);
    let canceled = false;

    async function start() {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (canceled) return;
        const cameraId = devices?.[0]?.id;
        await html5QrCode.start(
          { facingMode: "environment", deviceId: cameraId },
          camConfig,
          onScan,
          (e) => {}
        );
      } catch (e) {
        setErr(String(e));
      }
    }
    start();

    return () => {
      canceled = true;
      html5QrCode.stop().catch(() => {}).finally(() => html5QrCode.clear());
    };
  }, [onScan]);

  return (
    <div className="card">
      <h2>Сканирование QR</h2>
      <div id={divId.current} style={{ width: 320, margin: "0 auto" }} />
      {err && <div className="error">{err}</div>}
    </div>
  );
}
