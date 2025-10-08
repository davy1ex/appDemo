import { apiRequest } from '@/shared/api';
import { User } from '@/shared/types';

export interface AuthResponse {
  token: string;
  profile: User;
}

export class AuthApiService {
  /**
   * Authenticate with Telegram Mini App
   */
  static async authenticateWithTelegram(initDataRaw: string, tgUserId?: number): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/api/auth/tg', {
      method: 'POST',
      headers: {
        'Authorization': `tma ${initDataRaw}`,
      },
      body: {
        tg_user_id: tgUserId,
      },
    });
  }

  /**
   * Register additional user data from Telegram
   */
  static async registerFromTelegram(token: string, sex: 'male' | 'female'): Promise<{ ok: boolean; profile: User }> {
    return apiRequest<{ ok: boolean; profile: User }>('/api/register-from-tg', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: { sex },
    });
  }
}
