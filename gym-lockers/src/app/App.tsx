import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";


export default function App() {
  const [userId, setUserId] = useState(null);
    useEffect(() => {
  const tg = window.Telegram?.WebApp;
  console.log("TG present:", !!tg);
  console.log("initData:", tg?.initData);             // строка tgWebAppData
  console.log("initDataUnsafe:", tg?.initDataUnsafe); // объект с user, chat_instance, hash

  if (!tg) {
    console.warn("Открыто вне Telegram Mini App");
    return;
  }
  tg.ready();
  tg.expand();

  if (!tg.initDataUnsafe?.user?.id) {
    tg.showAlert("Нет user.id — запусти из бота через WebApp кнопку.");
  }
}, []);

  useEffect(() => {
    console.log("111")
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, []);

  const handleGetId = () => {
    const tg = window.Telegram?.WebApp;
  const id = tg?.initDataUnsafe?.user?.id ?? null;

  setUserId(id);
  if (tg) {
    tg.showAlert(id ? `Ваш Telegram ID: ${id}` : "ID недоступен. Откройте из бота по WebApp-кнопке.");
  } else {
    alert("Открыто вне Telegram — запустите как Mini App.");
  }
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, Arial",
        padding: 16,
        color: "var(--tg-theme-text-color)",
        background: "var(--tg-theme-bg-color)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 18 }}>Получить Telegram ID</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Нажмите кнопку ниже для получения id из initDataUnsafe.user.id. [web:8]
      </p>
      <button
        onClick={handleGetId}
        style={{
          marginTop: 12,
          padding: "10px 16px",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          background: "var(--tg-theme-button-color)",
          color: "var(--tg-theme-button-text-color)",
        }}
      >
        Получить ID
      </button>

      <div style={{ marginTop: 16 }}>
        Текущий ID: {userId ?? "—"}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App/>);

// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import { AppProvider } from "./providers";
// // import { LockersPage } from "@/pages/lockers";
// import { QRScanPage } from "@/pages/qr-scan";
// // import { TrainingPage } from "@/pages/training";
// import "./styles.css";

// createRoot(document.getElementById("root")!).render(
//   <BrowserRouter>
//     {/* <AppProvider> */}
//       <Routes>
//         <Route path="/" element={<QRScanPage />} />
//         {/* <Route path="/open" element={<QRScanPage />} />
//         <Route path="/lockers" element={<LockersPage />} />
//         <Route path="/training" element={<TrainingPage />} /> */}
//       </Routes>
//     {/* </AppProvider> */}
//   </BrowserRouter>
// );
