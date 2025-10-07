// src/pages/Lockers.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiGetLockers, apiSearchClient, apiReserveLocker } from "../api/mockApi";
import { useAuth } from "../auth/AuthContext";

export default function LockersPage() {
  const { token } = useAuth();
  const [sex, setSex] = useState("male");
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [chosenClient, setChosenClient] = useState(null);
  const [err, setErr] = useState("");
  const loc = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE;


  const targetLocker = useMemo(() => new URLSearchParams(loc.search).get("locker"), [loc.search]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGetLockers({ sex })
      .then(data => { if (mounted) setLockers(data); })
      .catch(e => { if (mounted) setErr(e.message); })
      .finally(() => mounted && setLoading(false));
      
    return () => { mounted = false; };

    
  }, [sex]);

  useEffect(() => {
    let active = true;
    const t = setTimeout(async () => {
      const res = await apiSearchClient({ query });
      if (active) setClients(res);
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query]);

  const reserve = async (lockerId) => {
    setErr("");
    const responseFromReg = await fetch(`${API_BASE}/api/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Pushed to server")
      console.log(responseFromReg)
    try {
      const userName = chosenClient?.name || "Anon";
      const l = await apiReserveLocker({ lockerId, userName });
      setLockers(prev => prev.map(x => x.id === l.id ? l : x));
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="page">
      <header className="toolbar">
        <select value={sex} onChange={e=>setSex(e.target.value)}>
          <option value="male">Мужская</option>
          <option value="female">Женская</option>
        </select>
        <div className="search">
          <input placeholder="Поиск клиента: телефон или имя" value={query} onChange={e=>setQuery(e.target.value)} />
          {!!clients.length && (
            <div className="dropdown">
              {clients.map(c => (
                <div
                  key={c.id}
                  className={"dropdown-item" + (chosenClient?.id===c.id ? " active": "")}
                  onClick={()=>setChosenClient(c)}
                >
                  {c.name} · {c.phone}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {err && <div className="error">{err}</div>}
      {loading ? <p>Загрузка...</p> : (
        <div className="grid">
            
          {lockers.map(l => (
            <div
              key={l.id}
              className={"locker" + (l.busyBy ? " busy" : " free") + (String(l.id)===String(targetLocker) ? " highlight" : "")}
            >
              <div className="lid">
                <span>#{l.id}</span>
                <span>{l.busyBy ? `Занят: ${l.busyBy}` : "Свободен"}</span>
              </div>
              {!l.busyBy && (
                <button onClick={()=>reserve(l.id)}>Забронировать</button>
              )}
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}
