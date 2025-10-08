// Mock API for development - simulates backend responses
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// In-memory state for development
let state = {
  users: [
    { id: 1, phone: "123456", name: "Ivan", sex: "male" },
    { id: 2, phone: "789012", name: "Anna", sex: "female" },
    { id: 3, phone: "345678", name: "Petr", sex: "male" },
  ],
  lockers: [
    { id: 101, sex: "male", busyBy: null },
    { id: 102, sex: "male", busyBy: "Ivan" },
    { id: 103, sex: "male", busyBy: null },
    { id: 201, sex: "female", busyBy: null },
    { id: 202, sex: "female", busyBy: "Anna" },
    { id: 203, sex: "female", busyBy: null },
  ],
  sessions: {}, // by userId
};

// Authentication functions
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

// Locker functions
export async function apiGetLockers({ sex }) {
  await delay(200);
  return state.lockers.filter(l => l.sex === sex);
}

export async function apiReserveLocker({ lockerId, userName }) {
  await delay(200);
  const locker = state.lockers.find(x => x.id === lockerId);
  if (!locker) throw new Error("Locker not found");
  if (locker.busyBy) throw new Error("Already busy");
  
  // Check if user already has a locker reserved
  const userCurrentLocker = state.lockers.find(l => l.busyBy === userName);
  if (userCurrentLocker) {
    throw new Error(`You already have locker #${userCurrentLocker.id} reserved. Please release it first.`);
  }
  
  locker.busyBy = userName;
  return locker;
}

export async function apiReleaseLocker({ lockerId, userName }) {
  await delay(200);
  const locker = state.lockers.find(x => x.id === lockerId);
  if (!locker) throw new Error("Locker not found");
  if (locker.busyBy !== userName) throw new Error("You don't have permission to release this locker");
  
  locker.busyBy = null;
  return locker;
}

export async function apiGetUserLocker({ userName }) {
  await delay(200);
  return state.lockers.find(l => l.busyBy === userName) || null;
}

export async function apiFinishTraining({ userId }) {
  await delay(200);
  // Release all lockers occupied by this user
  const user = state.users.find(u => u.id === userId);
  state.lockers.forEach(locker => { 
    if (locker.busyBy === user?.name) locker.busyBy = null; 
  });
  state.sessions[userId] = { finishedAt: Date.now() };
  return { ok: true };
}

// Client search functions
export async function apiSearchClient({ query }) {
  await delay(200);
  if (!query) return [];
  return state.users.filter(user => 
    user.phone.includes(query) || 
    (user.name || "").toLowerCase().includes(query.toLowerCase())
  );
}

// Generic API helper function
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
