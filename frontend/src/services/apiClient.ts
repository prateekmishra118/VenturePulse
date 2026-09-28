const API_BASE = '/api';
const TOKEN_KEY = 'venturepulse_token';

export class ApiClientError extends Error {
  status: number;
  fieldErrors?: Array<{ field: string; message: string }>;

  constructor(message: string, status: number, fieldErrors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

/**
 * Every API call goes through here. Attaches the auth token when present,
 * always parses the { success, message, data } / { success, message,
 * errors } envelope, and throws ApiClientError with the backend's own
 * message on failure — callers can display err.message directly.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw new ApiClientError('Could not reach the server. Check your connection and try again.', 0);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiClientError(`Unexpected server response (status ${response.status}).`, response.status);
  }

  const body = payload as { success: boolean; message: string; data?: T; errors?: Array<{ field: string; message: string }> };

  if (!body.success) {
    throw new ApiClientError(body.message || 'Something went wrong.', response.status, body.errors);
  }

  return body.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' })
};
