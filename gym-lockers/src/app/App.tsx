import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { SignUpPage } from "@/pages/sign-up/SignUpPage";
import { fetchIsItNewClient, pushClient } from "@/features/signUp/singUpNewClient";
import { redirect } from "react-router-dom";
import { QRScanPage } from "@/pages/qr-scan";

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
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);

  // Проверяем статус клиента после инициализации WebApp
  useEffect(() => {
    if (!ready) return;
    let aborted = false;

    (async () => {
      // Временно используем локальный кэш; лучше спросить сервер по initDataRaw
      const localFlag = fetchIsItNewClient();
      if (!aborted) {
        setIsNewClient(localFlag);
        setLoadingProfile(false);
      }
      // Пример серверной проверки (раскомментировать при готовом API):
      // try {
      //   const { data } = await axios.get<CheckResp>("/api/me", {
      //     headers: { Authorization: `tma ${initDataRaw}` },
      //   });
      //   if (!aborted) setIsNewClient(!!data.isNewClient);
      // } catch {
      //   if (!aborted) setIsNewClient(true);
      // } finally {
      //   if (!aborted) setLoadingProfile(false);
      // }
    })();

    return () => {
      aborted = true;
    };
  }, [ready /*, initDataRaw*/]);

  if (error) return <div>{error}</div>;
  if (!ready) return <div>Загрузка Mini App…</div>;
  if (loadingProfile || isNewClient === null) return <div>Проверка профиля…</div>;

  if (isNewClient) {
    return (
      <SignUpPage
        onSubmit={async (form) => {
          const tg = window.Telegram?.WebApp;
          const idNum = tg?.initDataUnsafe?.user?.id ?? null;
          const telegramId = idNum != null ? String(idNum) : "";
          await pushClient({
            firstName: form.form.firstName,
            middleName: form.form.middleName ?? "",
            lastName: form.form.lastName,
            telegramId,
            gender: form.form.gender as "M" | "W",
          });
          // Опционально: после успешной регистрации обновить локальный флаг
          // и показать основной экран
          setIsNewClient(false);
          localStorage.setItem("isLogined", "true");
          tg?.showAlert("Регистрация завершена");
        }}
      />
    );
  }

  return (
    // <div>
    //   <h1>Тут будут храниться шкафчики</h1>
    //   <img
    //     src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyNmV6bzJtMTJkemZlNnhydHI5aHludXQzYTlnMGlidTRhbm1mY3NkNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Fu4xiFsAEwkDZrkp8H/200w.gif"
    //     alt=""
    //   />
    // </div>
    <QRScanPage/>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
