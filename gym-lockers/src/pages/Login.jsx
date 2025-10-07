// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiLogin } from "../api/mockApi";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { token, user } = await apiLogin({ phone, password });
      await login({ token, user });
      nav("/", { replace: true });
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="card">
      <h2>Авторизация</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Телефон" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="error">{err}</div>}
        <button type="submit">Войти</button>
      </form>
      <p>Нет аккаунта? <Link to="/register">Регистрация</Link></p>
    </div>
  );
}
