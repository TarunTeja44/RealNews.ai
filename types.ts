
export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description: string;
}

export interface NewsVerification {
  found: boolean;
  articles: NewsArticle[];
  total_sources: number;
  sources_checked: number;
  sources_found: number;
  source_agreement: "high" | "moderate" | "low" | "none";
}

export interface AnalysisResult {
  language: string;
  prediction: "real" | "fake";
  confidence: number;
  confidence_note: string;
  reasoning: string; // Summary in regional/local language
  reasoning_english: string; // Summary in English
  detailed_breakdown: string[]; // List of specific facts found
  verification_note: string;
  verified_at: string;
  news_verification: NewsVerification;
  sources: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  claim: string;
  result: AnalysisResult;
}

export enum LanguageCode {
  AUTO = "auto",
  TELUGU = "te",
  HINDI = "hi",
  ENGLISH = "en"
}
