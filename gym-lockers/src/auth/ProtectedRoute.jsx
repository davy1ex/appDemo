// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="card">Загрузка...</div>;
  if (!token) return <div className="card">Нет доступа (Mini App не авторизовал).</div>;
  return children;
}
