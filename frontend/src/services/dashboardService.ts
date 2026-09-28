import { api } from './apiClient';
import type { DashboardData } from '@/types/api';

export function getDashboard() {
  return api.get<DashboardData>('/dashboard');
}
