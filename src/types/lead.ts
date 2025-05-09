import { Json } from "@/integrations/supabase/types";

export type LeadStatus = "new" | "contacted" | "in_progress" | "closed_won" | "closed_lost";
export type EmailDomainType = "public" | "business";

export interface EmailAddress {
  type: "personal" | "business" | "other";
  email: string;
}

export interface LeadActivity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface AssignedUser {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
}

export interface Lead {
  id: string;
  ticket_id: string | null;
  website: string | null;
  email: string | null;
  email_type?: "personal" | "business" | "other";
  domain: string | null;
  domains: string[] | null;
  lead_source_website: string | null;
  phone_numbers: string[] | null;
  subject: string | null;
  message: string | null;
  lead_type: string | null;
  client_type: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  bounce_count: number | null;
  call_count: number | null;
  status: LeadStatus;
  assigned_to: string | null;
  assignedTo?: AssignedUser | null;
  created_at: string;
  updated_at: string | null;
  contact_id: string | null;
  ip_country: string | null;
  ip_region: string | null;
  handled: boolean | null;
  emails: EmailAddress[] | null;
  budget_range: string | null;
  decision_maker_level: string | null;
  need_urgency: string | null;
  project_timeline: string | null;
  company_size: string | null;
  industry_vertical: string | null;
  annual_revenue_range: string | null;
  technology_stack: string[] | null;
  bant_score: number | null;
  engagement_score: number | null;
  account_score: number | null;
  market_score: number | null;
  beam_score: number | null;
  domain_type: EmailDomainType | null;
  lead_activities?: LeadActivity[] | null;
  company_name: string | null;
  location: string | null;
}

export type DatabaseLead = Omit<Lead, 'emails' | 'assignedTo'> & {
  emails: Json;
};

export const convertToDatabaseLead = (lead: Partial<Lead>): Partial<DatabaseLead> => ({
  ...lead,
  emails: lead.emails as unknown as Json,
});

export const convertFromDatabase = (dbLead: DatabaseLead): Lead => ({
  ...dbLead,
  emails: dbLead.emails as unknown as EmailAddress[] | null,
});