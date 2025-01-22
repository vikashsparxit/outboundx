export type LeadStatus = "new" | "contacted" | "in_progress" | "closed_won" | "closed_lost";

export interface Lead {
  id: string;
  ticket_id: string | null;
  website: string | null;
  email: string | null;
  domain: string | null;
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
  created_at: string;
  updated_at: string | null;
}