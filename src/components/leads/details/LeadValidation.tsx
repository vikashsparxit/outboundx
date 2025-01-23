import { z } from "zod";

export const websiteSchema = z
  .string()
  .url("Please enter a valid URL (e.g., https://example.com)")
  .optional()
  .or(z.literal(""));

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .optional()
  .or(z.literal(""));

export const domainSchema = z
  .string()
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, {
    message: "Please enter a valid domain name (e.g., example.com)",
  })
  .optional()
  .or(z.literal(""));

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number",
  })
  .optional()
  .or(z.literal(""));

export const validateLead = (lead: any) => {
  const errors: Record<string, string> = {};

  // Validate website
  if (lead.website) {
    try {
      websiteSchema.parse(lead.website);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.website = error.errors[0].message;
      }
    }
  }

  // Validate email
  if (lead.email) {
    try {
      emailSchema.parse(lead.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.email = error.errors[0].message;
      }
    }
  }

  // Validate domains
  if (lead.domains) {
    lead.domains.forEach((domain: string, index: number) => {
      try {
        domainSchema.parse(domain);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors[`domains.${index}`] = error.errors[0].message;
        }
      }
    });
  }

  // Validate phone numbers
  if (lead.phone_numbers) {
    lead.phone_numbers.forEach((phone: string, index: number) => {
      try {
        phoneSchema.parse(phone);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors[`phone_numbers.${index}`] = error.errors[0].message;
        }
      }
    });
  }

  return errors;
};