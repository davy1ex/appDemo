import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import axios from "axios";
import { SignUpPage } from "@/pages/sign-up/SignUpPage";
import { fetchIsItNewClient } from "@/features/signUp/singUpNewClient";
// import { useAuthStore } from "@/stores/auth"; // опционально Zustand

type CheckResp = { isNewClient: boolean; userId: number };

function useTelegramInit() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initDataRaw, setInitDataRaw] = useState<string>("");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setError("Открыто вне Telegram Mini App");
      return;
    }
    try {
      tg.ready();
      tg.expand();
      const idNum = tg.initDataUnsafe?.user?.id ?? null;
      setUserId(idNum != null ? String(idNum) : null);
      setInitDataRaw(tg.initData || "");
      setReady(true);
    } catch (e) {
      setError("Ошибка инициализации WebApp");
    }
  }, []);

  return { ready, error, userId, initDataRaw };
}

export default function App() {
  const { ready, error, userId, initDataRaw } = useTelegramInit();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const isNewClient = fetchIsItNewClient()

//   const handleGetId = () => {
//     const tg = window.Telegram?.WebApp;
//     if (!tg) {
//       alert("Открыто вне Telegram — запустите как Mini App.");
//       return;
//     }
//     const id = userId ?? "";
//     tg.showAlert(id ? `Ваш Telegram ID: ${id}` : "ID недоступен. Откройте из бота по WebApp‑кнопке.");
//   };

  if (error) return <div>{error}</div>;
  if (!ready) return <div>Загрузка Mini App…</div>;
  if (loadingProfile) return <div>Проверка профиля…</div>;

  return isNewClient ? (
    <SignUpPage
      onSubmit={async (form) => {
        await axios.post(`/api/register`, form, {
          headers: { Authorization: `tma ${initDataRaw}` },
        });
        setIsNewClient(false);
      }}
    />
  ) : (
    <div>
        <h1>Тут будут храниться шкафчики</h1>
        <img src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyNmV6bzJtMTJkemZlNnhydHI5aHludXQzYTlnMGlidTRhbm1mY3NkNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Fu4xiFsAEwkDZrkp8H/200w.gif" alt="" srcset="" />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App/>)
