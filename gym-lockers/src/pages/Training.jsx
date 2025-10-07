// src/pages/Training.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFinishTraining } from "../api/mockApi";

export default function TrainingPage() {
  const { token } = useAuth();
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  const finish = async () => {
    setErr(""); setStatus("");
    try {
      // Допустим, userId хранится в токене/контексте; для простоты mock: фиксированный id=1
      const res = await apiFinishTraining({ userId: 1 });
      if (res.ok) setStatus("Тренировка завершена");
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="card">
      <h2>Завершение тренировки</h2>
      <button onClick={finish}>Завершить тренировку</button>
      {status && <div className="ok">{status}</div>}
      {err && <div className="error">{err}</div>}
    </div>
  );
}
