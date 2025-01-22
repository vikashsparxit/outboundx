import { Lead, LeadStatus, EmailAddress } from "@/types/lead";

export const validateRequiredFields = (lead: any) => {
  const requiredFields = ['ticket_id', 'email'];
  const missingFields = requiredFields.filter(field => !lead[field]);
  
  if (missingFields.length > 0) {
    console.warn(`Missing required fields: ${missingFields.join(', ')}`);
    return false;
  }
  return true;
};

export const parseEmails = (emailsStr: string): EmailAddress[] => {
  if (!emailsStr) return [];
  try {
    return emailsStr.split(',').map((email, index) => {
      let type: "business" | "personal" | "other" = "other";
      if (index === 0) type = "business";
      else if (index === 1) type = "personal";
      return { type, email: email.trim() };
    });
  } catch (error) {
    console.error("Error parsing emails:", error);
    return [];
  }
};

export const parsePhoneNumbers = (phoneStr: string): string[] => {
  if (!phoneStr) return [];
  try {
    return phoneStr.split(',')
      .map(phone => phone.trim())
      .filter(phone => phone.length > 0);
  } catch (error) {
    console.error("Error parsing phone numbers:", error);
    return [];
  }
};

export const validateAndTransformLead = (rawLead: any): Partial<Lead> | null => {
  console.log("Validating lead data:", rawLead);
  
  if (!validateRequiredFields(rawLead)) {
    return null;
  }

  const transformedLead: Partial<Lead> = {};

  // Map and validate status
  const status = rawLead.status?.toLowerCase();
  transformedLead.status = (status && ["new", "contacted", "in_progress", "closed_won", "closed_lost"].includes(status))
    ? status as LeadStatus
    : "new";

  // Transform emails and phone numbers
  transformedLead.email = rawLead.email?.split(',')[0]?.trim(); // Primary email
  transformedLead.emails = parseEmails(rawLead.email);
  transformedLead.phone_numbers = parsePhoneNumbers(rawLead.phone_numbers);

  // Convert numeric fields
  transformedLead.bounce_count = Number(rawLead.bounce_count) || 0;
  transformedLead.call_count = Number(rawLead.call_count) || 0;

  // Handle boolean fields
  transformedLead.handled = rawLead.handled === 'true' || rawLead.handled === true;

  // Map text fields
  const textFields = [
    'ticket_id', 'website', 'contact_id', 'domain',
    'subject', 'message', 'lead_type', 'client_type',
    'country', 'city', 'state', 'ip_country', 'ip_region'
  ] as const;

  textFields.forEach(field => {
    if (rawLead[field] !== undefined && rawLead[field] !== null) {
      transformedLead[field] = String(rawLead[field]).trim();
    }
  });

  console.log("Transformed lead:", transformedLead);
  return transformedLead;
};