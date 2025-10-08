import { Locker } from '@/shared/types';

// Mock API for development - simulates backend responses
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// In-memory state for development
let state = {
  users: [
    { id: 1, phone: "123456", name: "Ivan", sex: "male" as const },
    { id: 2, phone: "789012", name: "Anna", sex: "female" as const },
    { id: 3, phone: "345678", name: "Petr", sex: "male" as const },
  ],
  lockers: [
    { id: 101, sex: "male" as const, busyBy: null },
    { id: 102, sex: "male" as const, busyBy: "Ivan" },
    { id: 103, sex: "male" as const, busyBy: null },
    { id: 201, sex: "female" as const, busyBy: null },
    { id: 202, sex: "female" as const, busyBy: "Anna" },
    { id: 203, sex: "female" as const, busyBy: null },
  ],
  sessions: {}, // by userId
};

export class LockerMockApiService {
  static async getLockers(token: string, sex?: 'male' | 'female'): Promise<Locker[]> {
    await delay(200);
    return state.lockers.filter(l => !sex || l.sex === sex);
  }

  static async reserveLocker(token: string, lockerId: number, userName: string): Promise<Locker> {
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

  static async releaseLocker(token: string, lockerId: number, userName: string): Promise<Locker> {
    await delay(200);
    const locker = state.lockers.find(x => x.id === lockerId);
    if (!locker) throw new Error("Locker not found");
    if (locker.busyBy !== userName) throw new Error("You don't have permission to release this locker");
    
    locker.busyBy = null;
    return locker;
  }

  static async getUserLocker(token: string, userName: string): Promise<Locker | null> {
    await delay(200);
    return state.lockers.find(l => l.busyBy === userName) || null;
  }

  static async finishTraining(token: string): Promise<{ ok: boolean }> {
    await delay(200);
    // Release all lockers occupied by this user
    const user = state.users.find(u => u.name === userName);
    state.lockers.forEach(locker => { 
      if (locker.busyBy === user?.name) locker.busyBy = null; 
    });
    return { ok: true };
  }
}
