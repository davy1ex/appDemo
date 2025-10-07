// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiRegister } from "../api/mockApi";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("male");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const responseFromReg = await fetch(`${API_BASE}/api/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Pushed to server")
      console.log(responseFromReg)
     
      const { token, user } = await apiRegister({ phone, name, sex, password });
      await login({ token, user });
      nav("/", { replace: true });
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="card">
      <h2>Регистрация</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Телефон" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input placeholder="Имя" value={name} onChange={e=>setName(e.target.value)} />
        <select value={sex} onChange={e=>setSex(e.target.value)}>
          <option value="male">Мужская</option>
          <option value="female">Женская</option>
        </select>
        <input placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="error">{err}</div>}
        <button type="submit">Создать</button>
      </form>
      <p>Есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}
