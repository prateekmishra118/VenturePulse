import { api } from './apiClient';
import type { Analysis, AnalysisSummary, ImprovedIdea, MvpPlan, ValidationExperiment, Report } from '@/types/api';

export function analyzeIdea(ideaId: string) {
  return api.post<AnalysisSummary>(`/ideas/${ideaId}/analyze`);
}

export function getAnalysis(analysisId: string) {
  return api.get<Analysis>(`/analyses/${analysisId}`);
}

export function improveIdea(analysisId: string) {
  return api.post<ImprovedIdea>(`/analyses/${analysisId}/improve`);
}

export function generateMvp(analysisId: string) {
  return api.post<MvpPlan>(`/analyses/${analysisId}/mvp`);
}

export function generateExperiments(analysisId: string) {
  return api.post<ValidationExperiment[]>(`/analyses/${analysisId}/experiments`);
}

export function generateReport(analysisId: string) {
  return api.post<Report>(`/analyses/${analysisId}/report`);
}
