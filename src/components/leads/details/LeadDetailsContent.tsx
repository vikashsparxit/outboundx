import { Lead } from "@/types/lead";
import { LeadIdentification } from "./LeadIdentification";
import { LeadContact } from "./LeadContact";
import { LeadOnlinePresence } from "./LeadOnlinePresence";
import { LeadLocation } from "./LeadLocation";
import { LeadScoringCriteria } from "./LeadScoringCriteria";
import { LeadStatusUpdate } from "./LeadStatusUpdate";
import ScoreBreakdown from "../scoring/ScoreBreakdown";
import ScoreHistory from "../scoring/ScoreHistory";
import ActivityLog from "../ActivityLog";
import LeadAnalysis from "../analysis/LeadAnalysis";

interface LeadDetailsContentProps {
  lead: Lead;
  isEditing: boolean;
  isUpdating: boolean;
  editedLead: Partial<Lead>;
  setEditedLead: (lead: Partial<Lead>) => void;
  validationErrors: Record<string, string>;
  renderField: (label: string, value: string | null, field: keyof Lead) => JSX.Element;
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onEmailChange: (index: number, field: "type" | "email", value: string) => void;
  onAddPhoneNumber: () => void;
  onRemovePhoneNumber: (index: number) => void;
  onPhoneNumberChange: (index: number, value: string) => void;
  formatEmails: (emails: any[] | null) => string;
  formatPhoneNumbers: (numbers: string[] | null) => string;
  onAddDomain: () => void;
  onRemoveDomain: (index: number) => void;
  onDomainChange: (index: number, value: string) => void;
  onAddTechnology: (tech: string) => void;
  onStatusUpdate: (status: Lead['status']) => void;
}

export const LeadDetailsContent = ({
  lead,
  isEditing,
  isUpdating,
  editedLead,
  setEditedLead,
  validationErrors,
  renderField,
  onAddEmail,
  onRemoveEmail,
  onEmailChange,
  onAddPhoneNumber,
  onRemovePhoneNumber,
  onPhoneNumberChange,
  formatEmails,
  formatPhoneNumbers,
  onAddDomain,
  onRemoveDomain,
  onDomainChange,
  onAddTechnology,
  onStatusUpdate,
}: LeadDetailsContentProps) => {
  console.log('Rendering LeadDetailsContent with lead:', lead);
  console.log('Domain type:', lead.domain_type);
  
  return (
    <div className="mt-6 space-y-6">
      <ScoreBreakdown lead={lead} />
      
      {lead.domain_type === 'business' && (
        <div id="lead-analysis-section" className="lead-analysis-section">
          <LeadAnalysis lead={lead} />
        </div>
      )}

      <LeadIdentification 
        lead={lead}
        isEditing={isEditing}
        editedLead={editedLead}
        setEditedLead={setEditedLead}
        renderField={renderField}
      />

      <LeadContact 
        lead={lead}
        isEditing={isEditing}
        editedLead={editedLead}
        setEditedLead={setEditedLead}
        onAddEmail={onAddEmail}
        onRemoveEmail={onRemoveEmail}
        onEmailChange={onEmailChange}
        onAddPhoneNumber={onAddPhoneNumber}
        onRemovePhoneNumber={onRemovePhoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
        formatEmails={formatEmails}
        formatPhoneNumbers={formatPhoneNumbers}
        validationErrors={validationErrors}
        renderField={renderField}
      />

      <LeadOnlinePresence 
        lead={lead}
        isEditing={isEditing}
        editedLead={editedLead}
        setEditedLead={setEditedLead}
        validationErrors={validationErrors}
        onAddDomain={onAddDomain}
        onRemoveDomain={onRemoveDomain}
        onDomainChange={onDomainChange}
        renderField={renderField}
      />

      <LeadLocation 
        lead={lead}
        isEditing={isEditing}
        editedLead={editedLead}
        setEditedLead={setEditedLead}
      />

      <LeadScoringCriteria
        lead={lead}
        isEditing={isEditing}
        editedLead={editedLead}
        setEditedLead={setEditedLead}
        onAddTechnology={onAddTechnology}
      />

      <ScoreHistory leadId={lead.id} />
      
      <ActivityLog leadId={lead.id} />

      {!isEditing && (
        <LeadStatusUpdate 
          lead={lead}
          isUpdating={isUpdating}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};