export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface AnalysisCategory {
  name: string;
  weight: number;
  description: string;
}

export interface ExampleCategoryScore {
  name: string;
  score: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}
