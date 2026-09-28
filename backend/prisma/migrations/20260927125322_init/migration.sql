-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'ANALYZING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('WEAK', 'NEEDS_WORK', 'MODERATE_POTENTIAL', 'PROMISING', 'EXCEPTIONAL_POTENTIAL');

-- CreateEnum
CREATE TYPE "ScoreCategory" AS ENUM ('PROBLEM_STRENGTH', 'CUSTOMER', 'MARKET', 'COMPETITION', 'DIFFERENTIATION', 'BUSINESS_MODEL', 'FEASIBILITY', 'SCALABILITY', 'RISK');

-- CreateEnum
CREATE TYPE "DataConfidence" AS ENUM ('VERIFIED', 'ESTIMATE', 'ASSUMPTION', 'AI_RECOMMENDATION');

-- CreateEnum
CREATE TYPE "RiskType" AS ENUM ('MARKET', 'COMPETITION', 'FINANCIAL', 'TECHNICAL', 'OPERATIONAL', 'REGULATORY', 'CUSTOMER_ADOPTION');

-- CreateEnum
CREATE TYPE "RiskSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CompetitorSource" AS ENUM ('USER_PROVIDED', 'AI_DISCOVERED');

-- CreateEnum
CREATE TYPE "RecommendationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ExperimentDecision" AS ENUM ('PENDING', 'CONTINUE', 'MODIFY', 'REJECT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_ideas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "startup_name" TEXT NOT NULL,
    "idea_description" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "target_customer" TEXT NOT NULL,
    "location" TEXT,
    "industry" TEXT NOT NULL,
    "business_model" TEXT NOT NULL,
    "expected_pricing" TEXT,
    "existing_competitors" TEXT,
    "unique_selling_proposition" TEXT,
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startup_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "overall_score" DOUBLE PRECISION,
    "verdict" "Verdict",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "category" "ScoreCategory" NOT NULL,
    "score" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "rationale" TEXT NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_analyses" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "problem_clarity" TEXT NOT NULL,
    "problem_severity" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "target_customer_clarity" TEXT NOT NULL,
    "existing_alternatives" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "problem_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_analyses" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "market_opportunity" TEXT NOT NULL,
    "geographic_opportunity" TEXT NOT NULL,
    "growth_assumptions" TEXT NOT NULL,
    "tam_estimate" TEXT,
    "tam_confidence" "DataConfidence",
    "sam_estimate" TEXT,
    "sam_confidence" "DataConfidence",
    "som_estimate" TEXT,
    "som_confidence" "DataConfidence",
    "findings" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "market_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_analyses" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "direct_competitors" TEXT NOT NULL,
    "indirect_competitors" TEXT NOT NULL,
    "existing_alternatives" TEXT NOT NULL,
    "competitive_strengths" TEXT NOT NULL,
    "competitive_weaknesses" TEXT NOT NULL,
    "differentiation" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "competition_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "competition_analysis_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "target_market" TEXT,
    "features" TEXT,
    "differentiation" TEXT,
    "business_model" TEXT,
    "source" "CompetitorSource" NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_model_analyses" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "revenue_model" TEXT NOT NULL,
    "pricing_strategy" TEXT NOT NULL,
    "customer_acquisition" TEXT NOT NULL,
    "costs" TEXT NOT NULL,
    "monetization" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "business_model_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feasibility_analyses" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "technical_feasibility" TEXT NOT NULL,
    "operational_feasibility" TEXT NOT NULL,
    "financial_feasibility" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "feasibility_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_analyses" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "risk_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_items" (
    "id" TEXT NOT NULL,
    "risk_analysis_id" TEXT NOT NULL,
    "type" "RiskType" NOT NULL,
    "severity" "RiskSeverity" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "risk_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_critiques" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "biggest_risk" TEXT NOT NULL,
    "hidden_assumptions" TEXT[],
    "why_this_could_fail" TEXT[],
    "hard_questions" TEXT[],
    "recommended_actions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_critiques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "improved_ideas" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "original_idea" TEXT NOT NULL,
    "improved_idea" TEXT NOT NULL,
    "why_better" TEXT NOT NULL,
    "trade_offs" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "improved_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mvp_plans" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "must_have_features" TEXT[],
    "should_have_features" TEXT[],
    "later_features" TEXT[],
    "target_users" TEXT NOT NULL,
    "core_user_journey" TEXT NOT NULL,
    "development_priority" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mvp_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "RecommendationPriority" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validation_experiments" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "experiment_name" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "required_sample" TEXT NOT NULL,
    "success_metric" TEXT NOT NULL,
    "failure_threshold" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "decision" "ExperimentDecision" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validation_experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "startup_ideas_user_id_idx" ON "startup_ideas"("user_id");

-- CreateIndex
CREATE INDEX "analyses_idea_id_idx" ON "analyses"("idea_id");

-- CreateIndex
CREATE UNIQUE INDEX "scores_analysis_id_category_key" ON "scores"("analysis_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "problem_analyses_analysis_id_key" ON "problem_analyses"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "market_analyses_analysis_id_key" ON "market_analyses"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "competition_analyses_analysis_id_key" ON "competition_analyses"("analysis_id");

-- CreateIndex
CREATE INDEX "competitors_competition_analysis_id_idx" ON "competitors"("competition_analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_model_analyses_analysis_id_key" ON "business_model_analyses"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "feasibility_analyses_analysis_id_key" ON "feasibility_analyses"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "risk_analyses_analysis_id_key" ON "risk_analyses"("analysis_id");

-- CreateIndex
CREATE INDEX "risk_items_risk_analysis_id_idx" ON "risk_items"("risk_analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_critiques_analysis_id_key" ON "ai_critiques"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "improved_ideas_analysis_id_key" ON "improved_ideas"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "mvp_plans_analysis_id_key" ON "mvp_plans"("analysis_id");

-- CreateIndex
CREATE INDEX "recommendations_analysis_id_idx" ON "recommendations"("analysis_id");

-- CreateIndex
CREATE INDEX "validation_experiments_analysis_id_idx" ON "validation_experiments"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_analysis_id_key" ON "reports"("analysis_id");

-- AddForeignKey
ALTER TABLE "startup_ideas" ADD CONSTRAINT "startup_ideas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "startup_ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_analyses" ADD CONSTRAINT "problem_analyses_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_analyses" ADD CONSTRAINT "market_analyses_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_analyses" ADD CONSTRAINT "competition_analyses_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_competition_analysis_id_fkey" FOREIGN KEY ("competition_analysis_id") REFERENCES "competition_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_model_analyses" ADD CONSTRAINT "business_model_analyses_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feasibility_analyses" ADD CONSTRAINT "feasibility_analyses_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_analyses" ADD CONSTRAINT "risk_analyses_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_items" ADD CONSTRAINT "risk_items_risk_analysis_id_fkey" FOREIGN KEY ("risk_analysis_id") REFERENCES "risk_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_critiques" ADD CONSTRAINT "ai_critiques_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "improved_ideas" ADD CONSTRAINT "improved_ideas_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mvp_plans" ADD CONSTRAINT "mvp_plans_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validation_experiments" ADD CONSTRAINT "validation_experiments_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
