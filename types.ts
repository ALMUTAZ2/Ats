
export interface ApiResponse {
  message: string;
  timestamp: string;
  status: 'success' | 'error';
}

export interface ScanResponse {
  match_score: number;
  missing_skills: {
    hard_skills: string[];
    soft_skills: string[];
    certifications: string[];
    tools: string[];
  };
  recommendations: string[];
  tier: string;
}

export interface ProphetAuditResponse {
  meta_data: {
    detected_language: string;
    candidate_name: string;
    inferred_target_role: string;
    years_experience_estimated: number;
  };
  scores: {
    overall_score: number;
    impact_score: number;
    brevity_score: number;
    style_score: number;
    ats_compatibility_score: number;
  };
  summary_verdict: {
    headline: string;
    executive_summary: string;
  };
  line_by_line_analysis: {
    section: string;
    original_text: string;
    issue_type: string;
    severity: 'High' | 'Medium' | 'Low';
    explanation: string;
    suggested_rewrite: string;
  }[];
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

export enum ApiEndpoint {
  STATUS = '/status',
  ROOT = '/',
  SCAN = '/scan'
}
