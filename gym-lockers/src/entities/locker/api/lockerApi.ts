import { apiRequest, createAuthenticatedRequest } from '@/shared/api';
import { Locker } from '@/shared/types';

export class LockerApiService {
  /**
   * Get all lockers or filter by gender
   */
  static async getLockers(token: string, sex?: 'male' | 'female'): Promise<Locker[]> {
    const authenticatedRequest = createAuthenticatedRequest(token);
    const params = sex ? `?sex=${sex}` : '';
    return authenticatedRequest<Locker[]>(`/api/lockers${params}`);
  }

  /**
   * Reserve a locker for a user (only one locker per user allowed)
   */
  static async reserveLocker(token: string, lockerId: number, userName: string): Promise<Locker> {
    const authenticatedRequest = createAuthenticatedRequest(token);
    return authenticatedRequest<Locker>('/api/lockers/reserve', {
      method: 'POST',
      body: { lockerId, userName },
    });
  }

  /**
   * Release a specific locker
   */
  static async releaseLocker(token: string, lockerId: number, userName: string): Promise<Locker> {
    const authenticatedRequest = createAuthenticatedRequest(token);
    return authenticatedRequest<Locker>('/api/lockers/release', {
      method: 'POST',
      body: { lockerId, userName },
    });
  }

  /**
   * Get the locker currently reserved by a user
   */
  static async getUserLocker(token: string, userName: string): Promise<Locker | null> {
    const authenticatedRequest = createAuthenticatedRequest(token);
    return authenticatedRequest<Locker | null>(`/api/lockers/user/${encodeURIComponent(userName)}`);
  }

  /**
   * Release all lockers for a user (finish training)
   */
  static async finishTraining(token: string): Promise<{ ok: boolean }> {
    const authenticatedRequest = createAuthenticatedRequest(token);
    return authenticatedRequest<{ ok: boolean }>('/api/finish', {
      method: 'POST',
    });
  }
}
