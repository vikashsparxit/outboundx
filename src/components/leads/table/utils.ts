import { EmailAddress } from "@/types/lead";
import { getCountries } from "@/utils/locationData";

export const formatEmails = (emails: EmailAddress[] | null) => {
  if (!emails) return "-";
  return emails.map(e => e.email).join(", ");
};

export const formatPhoneNumbers = (numbers: string[] | null) => {
  if (!numbers) return "-";
  return numbers.join(", ");
};

export const getCountryCode = (countryName: string | null): string | null => {
  if (!countryName) return null;
  
  const countries = getCountries();
  const country = countries.find(
    c => c.name.toLowerCase() === countryName.toLowerCase()
  );
  
  return country?.isoCode.toLowerCase() || null;
};