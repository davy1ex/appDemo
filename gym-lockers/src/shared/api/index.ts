// Shared API configuration and utilities
const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    defaultOptions.body = JSON.stringify(options.body);
  }

  if (options.method) {
    defaultOptions.method = options.method;
  }

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export function createAuthenticatedRequest(token: string) {
  return <T>(endpoint: string, options: ApiRequestOptions = {}) => {
    return apiRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  };
}
