import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Lead } from "@/types/lead";
import { useLeadEdit } from "@/hooks/use-lead-edit";
import { useLeadStatus } from "@/hooks/use-lead-status";
import { useLeadContact } from "@/hooks/use-lead-contact";
import { LeadFormField } from "./details/LeadFormField";
import { LeadSubscription } from "./details/LeadSubscription";
import { LeadDetailsHeader } from "./details/LeadDetailsHeader";
import { LeadDetailsContent } from "./details/LeadDetailsContent";
import { LeadIdentification } from "./details/LeadIdentification";

interface LeadDetailsProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: () => void;
}

const LeadDetails = ({ lead, isOpen, onClose, onLeadUpdate }: LeadDetailsProps) => {
  const {
    isUpdating,
    isEditing,
    editedLead,
    validationErrors,
    setIsEditing,
    setEditedLead,
    handleEdit,
  } = useLeadEdit(lead, onLeadUpdate);

  const { handleStatusUpdate } = useLeadStatus(lead, onLeadUpdate);

  const {
    onAddEmail,
    onRemoveEmail,
    onEmailChange,
    onAddPhoneNumber,
    onRemovePhoneNumber,
    onPhoneNumberChange,
    formatEmails,
    formatPhoneNumbers,
  } = useLeadContact(editedLead, (updatedLead: Lead) => setEditedLead(updatedLead));

  const renderField = (label: string, value: string | null, field: keyof Lead) => (
    <LeadFormField
      label={label}
      value={value}
      field={field}
      isEditing={isEditing}
      onChange={(value) => setEditedLead({ ...editedLead, [field]: value })}
    />
  );

  const onAddDomain = () => {
    const newDomains = [...(editedLead.domains || []), ""];
    setEditedLead({ ...editedLead, domains: newDomains });
  };

  const onRemoveDomain = (index: number) => {
    const newDomains = [...(editedLead.domains || [])];
    newDomains.splice(index, 1);
    setEditedLead({ ...editedLead, domains: newDomains });
  };

  const onDomainChange = (index: number, value: string) => {
    const newDomains = [...(editedLead.domains || [])];
    newDomains[index] = value;
    setEditedLead({ ...editedLead, domains: newDomains });
  };

  const onAddTechnology = (tech: string) => {
    if (!editedLead.technology_stack?.includes(tech)) {
      const newTechStack = [...(editedLead.technology_stack || []), tech];
      setEditedLead({ ...editedLead, technology_stack: newTechStack });
    }
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto pb-20">
        <LeadSubscription lead={lead} onLeadUpdate={onLeadUpdate} />
        
        <LeadDetailsHeader
          isEditing={isEditing}
          isUpdating={isUpdating}
          onEdit={() => setIsEditing(true)}
          onSave={handleEdit}
          onCancel={() => {
            setIsEditing(false);
            setEditedLead(lead);
          }}
        />

        <LeadIdentification
          lead={lead}
          isEditing={isEditing}
          editedLead={editedLead}
          setEditedLead={setEditedLead}
          renderField={renderField}
        />
        
        <LeadDetailsContent
          lead={lead}
          isEditing={isEditing}
          isUpdating={isUpdating}
          editedLead={editedLead}
          setEditedLead={setEditedLead}
          validationErrors={validationErrors}
          renderField={renderField}
          onAddEmail={onAddEmail}
          onRemoveEmail={onRemoveEmail}
          onEmailChange={onEmailChange}
          onAddPhoneNumber={onAddPhoneNumber}
          onRemovePhoneNumber={onRemovePhoneNumber}
          onPhoneNumberChange={onPhoneNumberChange}
          formatEmails={formatEmails}
          formatPhoneNumbers={formatPhoneNumbers}
          onAddDomain={onAddDomain}
          onRemoveDomain={onRemoveDomain}
          onDomainChange={onDomainChange}
          onAddTechnology={onAddTechnology}
          onStatusUpdate={handleStatusUpdate}
        />
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetails;