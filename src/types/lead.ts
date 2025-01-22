import { Json } from "@/integrations/supabase/types";

export type LeadStatus = "new" | "contacted" | "in_progress" | "closed_won" | "closed_lost";

export interface EmailAddress {
  type: "personal" | "business" | "other";
  email: string;
}

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
  contact_id: string | null;
  ip_country: string | null;
  ip_region: string | null;
  handled: boolean | null;
  emails: EmailAddress[] | null;
}

export type DatabaseLead = Omit<Lead, 'emails'> & {
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