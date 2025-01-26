import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Lead } from "@/types/lead";
import { useLeadEdit } from "@/hooks/use-lead-edit";
import { useLeadStatus } from "@/hooks/use-lead-status";
import { useLeadContact } from "@/hooks/use-lead-contact";
import { LeadFormField } from "./details/LeadFormField";
import { LeadSubscription } from "./details/LeadSubscription";
import { LeadDetailsHeader } from "./details/LeadDetailsHeader";
import { LeadDetailsContent } from "./details/LeadDetailsContent";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeadDetailsProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: () => void;
}

const LeadDetails = ({ lead, isOpen, onClose, onLeadUpdate }: LeadDetailsProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const {
    isUpdating,
    isEditing,
    editedLead,
    validationErrors,
    setIsEditing,
    setEditedLead,
    handleEdit,
    resetEditState
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

  const handleStartEditing = () => {
    console.log('Starting edit mode with lead:', lead);
    setEditedLead(lead || {});
    setIsEditing(true);
  };

  const handleSheetClose = () => {
    console.log('Closing sheet, resetting edit state');
    resetEditState();
    setIsFullScreen(false);
    onClose();
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetClose}>
      <SheetContent 
        side="right"
        className={cn(
          "p-0 transition-all duration-300 ease-in-out",
          isFullScreen 
            ? "!w-screen !max-w-none !right-0" 
            : "w-[400px] sm:w-[600px]"
        )}
      >
        <div className="h-full flex flex-col">
          <LeadSubscription lead={lead} onLeadUpdate={onLeadUpdate} />
          
          <LeadDetailsHeader
            lead={lead}
            isEditing={isEditing}
            isUpdating={isUpdating}
            isFullScreen={isFullScreen}
            onEdit={handleStartEditing}
            onSave={handleEdit}
            onCancel={() => {
              setIsEditing(false);
              setEditedLead(lead);
            }}
            onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
          />
          
          <ScrollArea className="flex-1">
            <div className="px-6 pb-20">
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
                isFullScreen={isFullScreen}
              />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetails;