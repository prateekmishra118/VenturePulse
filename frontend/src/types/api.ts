export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export type AnalysisStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export type Verdict = 'WEAK' | 'NEEDS_WORK' | 'MODERATE_POTENTIAL' | 'PROMISING' | 'EXCEPTIONAL_POTENTIAL';

export type ScoreCategory =
  | 'PROBLEM_STRENGTH'
  | 'CUSTOMER'
  | 'MARKET'
  | 'COMPETITION'
  | 'DIFFERENTIATION'
  | 'BUSINESS_MODEL'
  | 'FEASIBILITY'
  | 'SCALABILITY'
  | 'RISK';

export interface AnalysisSummary {
  id: string;
  status: AnalysisStatus;
  overallScore: number | null;
  verdict: Verdict | null;
  createdAt: string;
  completedAt: string | null;
}

export interface StartupIdea {
  id: string;
  startupName: string;
  ideaDescription: string;
  problem: string;
  targetCustomer: string;
  location: string | null;
  industry: string;
  businessModel: string;
  expectedPricing: string | null;
  existingCompetitors: string | null;
  uniqueSellingProposition: string | null;
  additionalInfo: string | null;
  createdAt: string;
  updatedAt: string;
  analyses?: AnalysisSummary[];
}

export interface CreateIdeaInput {
  startupName: string;
  ideaDescription: string;
  problem: string;
  targetCustomer: string;
  location?: string;
  industry: string;
  businessModel: string;
  expectedPricing?: string;
  existingCompetitors?: string;
  uniqueSellingProposition?: string;
  additionalInfo?: string;
}

export interface Score {
  id: string;
  category: ScoreCategory;
  score: number;
  weight: number;
  rationale: string;
}

export interface CategoryDetail {
  findings: string;
  strength: string;
  weakness: string;
  recommendation: string;
}

export interface ProblemAnalysis extends CategoryDetail {
  problemClarity: string;
  problemSeverity: string;
  frequency: string;
  targetCustomerClarity: string;
  existingAlternatives: string;
}

export interface MarketAnalysis extends CategoryDetail {
  marketOpportunity: string;
  geographicOpportunity: string;
  growthAssumptions: string;
  tamEstimate?: string | null;
  tamConfidence?: string | null;
  samEstimate?: string | null;
  samConfidence?: string | null;
  somEstimate?: string | null;
  somConfidence?: string | null;
}

export interface Competitor {
  id: string;
  name: string;
  price?: string | null;
  targetMarket?: string | null;
  features?: string | null;
  differentiation?: string | null;
  businessModel?: string | null;
  source: 'USER_PROVIDED' | 'AI_DISCOVERED';
}

export interface CompetitionAnalysis extends CategoryDetail {
  directCompetitors: string;
  indirectCompetitors: string;
  existingAlternatives: string;
  competitiveStrengths: string;
  competitiveWeaknesses: string;
  differentiation: string;
  competitors: Competitor[];
}

export interface BusinessModelAnalysis extends CategoryDetail {
  revenueModel: string;
  pricingStrategy: string;
  customerAcquisition: string;
  costs: string;
  monetization: string;
}

export interface FeasibilityAnalysis extends CategoryDetail {
  technicalFeasibility: string;
  operationalFeasibility: string;
  financialFeasibility: string;
}

export interface RiskItem {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface RiskAnalysis extends CategoryDetail {
  risks: RiskItem[];
}

export interface AICritique {
  strengths: string[];
  weaknesses: string[];
  biggestRisk: string;
  hiddenAssumptions: string[];
  whyThisCouldFail: string[];
  hardQuestions: string[];
  recommendedActions: string[];
}

export interface ImprovedIdea {
  originalIdea: string;
  improvedIdea: string;
  whyBetter: string;
  tradeOffs: string[];
}

export interface MvpPlan {
  objective: string;
  mustHaveFeatures: string[];
  shouldHaveFeatures: string[];
  laterFeatures: string[];
  targetUsers: string;
  coreUserJourney: string;
  developmentPriority: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ValidationExperiment {
  id: string;
  experimentName: string;
  hypothesis: string;
  targetAudience: string;
  method: string;
  requiredSample: string;
  successMetric: string;
  failureThreshold: string;
  duration: string;
  decision: 'PENDING' | 'CONTINUE' | 'MODIFY' | 'REJECT';
}

export interface Report {
  content: string;
  generatedAt: string;
}

export interface Analysis {
  id: string;
  status: AnalysisStatus;
  overallScore: number | null;
  verdict: Verdict | null;
  createdAt: string;
  completedAt: string | null;
  idea: StartupIdea;
  scores: Score[];
  problemAnalysis: ProblemAnalysis | null;
  marketAnalysis: MarketAnalysis | null;
  competitionAnalysis: CompetitionAnalysis | null;
  businessModelAnalysis: BusinessModelAnalysis | null;
  feasibilityAnalysis: FeasibilityAnalysis | null;
  riskAnalysis: RiskAnalysis | null;
  aiCritique: AICritique | null;
  improvedIdea: ImprovedIdea | null;
  mvpPlan: MvpPlan | null;
  recommendations: Recommendation[];
  validationExperiments: ValidationExperiment[];
  report: Report | null;
}

export interface DashboardData {
  totalIdeas: number;
  ideasAnalyzed: number;
  averageScore: number | null;
  bestScore: number | null;
  recentAnalyses: Array<{
    id: string;
    status: AnalysisStatus;
    overallScore: number | null;
    verdict: Verdict | null;
    createdAt: string;
    idea: { id: string; startupName: string };
  }>;
  charts: {
    scoreHistory: Array<{ date: string; score: number | null; startupName: string }>;
    categoryComparison: Array<{ category: ScoreCategory; averageScore: number }>;
    riskDistribution: Array<{ severity: string; count: number }>;
  };
}
