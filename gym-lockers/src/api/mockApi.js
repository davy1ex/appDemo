// src/api/mockApi.js
const delay = (ms) => new Promise(r => setTimeout(r, ms));

let state = {
  users: [{ id: 1, phone: "123456", name: "Ivan", sex: "male" }],
  lockers: [
    { id: 101, sex: "male", busyBy: null },
    { id: 102, sex: "male", busyBy: "Ivan" },
    { id: 201, sex: "female", busyBy: null },
  ],
  sessions: {}, // by userId
};

export async function apiLogin({ phone, password }) {
  await delay(300);
  const user = state.users.find(u => u.phone === phone);
  if (user && password === "password") return { token: "mock-token", user }; 
  throw new Error("Invalid credentials");
}

export async function apiRegister({ phone, name, sex, password }) {
  await delay(300);
  const exists = state.users.some(u => u.phone === phone);
  if (exists) throw new Error("User exists");
  const user = { id: Date.now(), phone, name, sex };
  state.users.push(user);
  return { token: "mock-token", user };
}

export async function apiGetLockers({ sex }) {
  await delay(200);
  return state.lockers.filter(l => l.sex === sex);
}

export async function apiSearchClient({ query }) {
  await delay(200);
  if (!query) return [];
  return state.users.filter(u => u.phone.includes(query) || (u.name||"").toLowerCase().includes(query.toLowerCase()));
}

export async function apiReserveLocker({ lockerId, userName }) {
  await delay(200);
  const l = state.lockers.find(x => x.id === lockerId);
  if (!l) throw new Error("Locker not found");
  if (l.busyBy) throw new Error("Already busy");
  l.busyBy = userName;
  return l;
}

export async function apiFinishTraining({ userId }) {
  await delay(200);
  // Освобождаем все шкафчики, занятые этим пользователем по имени
  const user = state.users.find(u => u.id === userId);
  state.lockers.forEach(l => { if (l.busyBy === user?.name) l.busyBy = null; });
  state.sessions[userId] = { finishedAt: Date.now() };
  return { ok: true };
}

// пример функции запроса с токеном
async function api(url, opts = {}, token) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
