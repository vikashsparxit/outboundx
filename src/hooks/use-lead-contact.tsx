import { EmailAddress, Lead } from "@/types/lead";

export const useLeadContact = (editedLead: Partial<Lead>, setEditedLead: (lead: Partial<Lead>) => void) => {
  const onAddEmail = () => {
    const newEmails: EmailAddress[] = [...(editedLead.emails || []), { type: "business", email: "" }];
    setEditedLead({ ...editedLead, emails: newEmails });
  };

  const onRemoveEmail = (index: number) => {
    const newEmails = [...(editedLead.emails || [])];
    newEmails.splice(index, 1);
    setEditedLead({ ...editedLead, emails: newEmails });
  };

  const onEmailChange = (index: number, field: "type" | "email", value: string) => {
    const newEmails = [...(editedLead.emails || [])] as EmailAddress[];
    if (field === "type" && (value === "personal" || value === "business" || value === "other")) {
      newEmails[index] = { ...newEmails[index], [field]: value };
      setEditedLead({ ...editedLead, emails: newEmails });
    } else if (field === "email") {
      newEmails[index] = { ...newEmails[index], [field]: value };
      setEditedLead({ ...editedLead, emails: newEmails });
    }
  };

  const onAddPhoneNumber = () => {
    const newPhoneNumbers = [...(editedLead.phone_numbers || []), ""];
    setEditedLead({ ...editedLead, phone_numbers: newPhoneNumbers });
  };

  const onRemovePhoneNumber = (index: number) => {
    const newPhoneNumbers = [...(editedLead.phone_numbers || [])];
    newPhoneNumbers.splice(index, 1);
    setEditedLead({ ...editedLead, phone_numbers: newPhoneNumbers });
  };

  const onPhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...(editedLead.phone_numbers || [])];
    newPhoneNumbers[index] = value;
    setEditedLead({ ...editedLead, phone_numbers: newPhoneNumbers });
  };

  const formatEmails = (emails: EmailAddress[] | null) => {
    if (!emails || emails.length === 0) return "-";
    return emails.map(e => `${e.email} (${e.type})`).join(", ");
  };

  const formatPhoneNumbers = (numbers: string[] | null) => {
    if (!numbers || numbers.length === 0) return "-";
    return numbers.join(", ");
  };

  return {
    onAddEmail,
    onRemoveEmail,
    onEmailChange,
    onAddPhoneNumber,
    onRemovePhoneNumber,
    onPhoneNumberChange,
    formatEmails,
    formatPhoneNumbers,
  };
};