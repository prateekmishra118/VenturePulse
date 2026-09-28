import { api } from './apiClient';
import type { AuthResult, User } from '@/types/api';

export function register(input: { name: string; email: string; password: string }) {
  return api.post<AuthResult>('/auth/register', input);
}

export function login(input: { email: string; password: string }) {
  return api.post<AuthResult>('/auth/login', input);
}

export function getMe() {
  return api.get<User>('/auth/me');
}
