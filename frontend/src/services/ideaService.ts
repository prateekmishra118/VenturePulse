import { api } from './apiClient';
import type { StartupIdea, CreateIdeaInput } from '@/types/api';

export function createIdea(input: CreateIdeaInput) {
  return api.post<StartupIdea>('/ideas', input);
}

export function listIdeas() {
  return api.get<StartupIdea[]>('/ideas');
}

export function getIdea(id: string) {
  return api.get<StartupIdea>(`/ideas/${id}`);
}

export function deleteIdea(id: string) {
  return api.delete<null>(`/ideas/${id}`);
}
