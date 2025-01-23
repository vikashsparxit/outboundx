import { EmailAddress } from "@/types/lead";

export const formatEmails = (emails: EmailAddress[] | null) => {
  if (!emails) return "-";
  return emails.map(e => `${e.type}: ${e.email}`).join(", ");
};

export const formatPhoneNumbers = (numbers: string[] | null) => {
  if (!numbers) return "-";
  return numbers.join(", ");
};