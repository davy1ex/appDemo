// Shared types for the application
export interface User {
  id: number;
  name: string;
  username?: string;
  sex?: 'male' | 'female';
  phone?: string;
}

export interface Locker {
  id: number;
  sex: 'male' | 'female';
  busyBy: string | null;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  sex: 'male' | 'female';
}

export interface AuthState {
  token: string | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export interface LockerState {
  lockers: Locker[];
  userLocker: Locker | null;
  loading: boolean;
  error: string | null;
  selectedSex: 'male' | 'female';
}

export interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface TelegramInitData {
  initDataRaw: string;
  user: User | null;
}
