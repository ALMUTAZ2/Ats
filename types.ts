
export interface RawForensicMetrics {
  has_columns_tables: boolean;
  has_photo: boolean;
  has_graphic_icons: boolean;
  has_creative_headers: boolean;
  date_format_issues: boolean;
  total_bullet_points: number;
  bullets_with_numbers: number;
  weak_verbs_count: number;
  word_count: number;
}

export interface ProphetResponse {
  meta_data: {
    candidate_name: string;
    detected_language: string;
    inferred_target_role: string;
    years_experience: number;
  };
  scores: {
    overall_score: number;
    ats_compatibility: number;
    content_impact: number;
  };
  summary_verdict: {
    headline: string;
    executive_summary: string;
  };
  raw_metrics: RawForensicMetrics;
  structural_audit: {
    issues_found: string[];
    is_parsable: boolean;
  };
  keyword_analysis: {
    hard_skills_found: string[];
    missing_critical_skills: string[];
    buzzwords_to_remove: string[];
  };
  action_plan: string[];
}

/**
 * Added to fix "Module '../types.ts' has no exported member 'ApiResponse'"
 */
export interface ApiResponse {
  message: string;
  timestamp: string;
  status: 'success' | 'error';
}

/**
 * Added to fix "Module '../types.ts' has no exported member 'ScanResponse'"
 */
export interface ScanResponse {
  match_score: number;
  missing_skills: {
    hard_skills: string[];
    soft_skills: string[];
    tools: string[];
    certifications: string[];
  };
  recommendations: string[];
  tier: string;
}
