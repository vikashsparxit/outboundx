export interface LeadContext {
  message: string | null;
  subject: string | null;
  email: string | null;
  emails: any;
  phone_numbers: string[] | null;
  domain: string | null;
  domain_type: string | null;
  website: string | null;
  domains: string[] | null;
  company_size: string | null;
  industry_vertical: string | null;
  annual_revenue_range: string | null;
  technology_stack: string[] | null;
  budget_range: string | null;
  need_urgency: string | null;
  project_timeline: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  previous_activities: any[];
}

export interface Discovery {
  field_name: string;
  discovered_value: string;
  confidence_level: 'high' | 'medium' | 'low';
  source: string;
  metadata: Record<string, any>;
}

export interface ActivityAnalysis {
  website_status: boolean;
  website_last_updated: string | null;
  website_analysis_notes: string;
  social_media_platforms: string[];
  social_media_last_activity: string | null;
  social_media_notes: string;
  news_mentions_count: number;
  latest_news_date: string | null;
  news_sources: string[];
  active_job_postings: number;
  latest_job_posting_date: string | null;
  job_posting_platforms: string[];
  digital_footprint_score: number;
  digital_footprint_details: Record<string, any>;
  activity_status: 'active' | 'semi_active' | 'dormant' | 'inactive' | 'uncertain';
  confidence_level: 'high' | 'medium' | 'low';
}

export interface AnalysisResponse {
  discoveries: Discovery[];
  activity_analysis: ActivityAnalysis;
}