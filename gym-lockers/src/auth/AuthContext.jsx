// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

// Минимальная обертка без зависимостей: читаем initDataRaw из Telegram Mini App
function getTgInitData() {
  const w = window;
  const wa = w?.Telegram?.WebApp;
  // В Mini App доступно initData (строка) и initDataUnsafe (объект с user)
  const initDataRaw = wa?.initData || "";
  const user = wa?.initDataUnsafe?.user || null;
  return { initDataRaw, user };
}

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [{ token, profile, loading, error }, setAuth] = useState({
    token: null, profile: null, loading: true, error: null
  });

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const { initDataRaw, user } = getTgInitData();
        window.Telegram?.WebApp?.ready?.();
        // Dev fallback: если приложение запущено не в Telegram, можно разрешить мок-режим
        if (!initDataRaw) {
          // Закомментируйте, если хотите запретить не-Telegram окружение:
          // throw new Error("Not in Telegram Mini App");
          setAuth(s => ({ ...s, token: "dev-mock-token", profile: { id: 1, name: "Dev" }, loading: false }));
          return;
        }
        const res = await fetch("/api/auth/tg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Опционально дублируем initDataRaw в заголовке:
            "Authorization": `tma ${initDataRaw}`
          },
          body: JSON.stringify({
            // Можно передать что-то дополнительное (например, client version)
            tg_user_id: user?.id
          })
        });
        if (!res.ok) throw new Error("Auth failed");
        const data = await res.json(); // { token, profile }
        if (!cancelled) setAuth({ token: data.token, profile: data.profile, loading: false, error: null });
      } catch (e) {
        if (!cancelled) setAuth(s => ({ ...s, loading: false, error: e.message }));
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, []);

  const logout = () => setAuth({ token: null, profile: null, loading: false, error: null });

  return (
    <AuthContext.Provider value={{ token, profile, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
