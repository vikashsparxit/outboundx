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
import LeadDiscoveries from "../discoveries/LeadDiscoveries";
import { cn } from "@/lib/utils";

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
  isFullScreen: boolean;
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
  isFullScreen,
}: LeadDetailsContentProps) => {
  console.log('Rendering LeadDetailsContent with lead:', lead);
  console.log('Current lead data:', { lead, editedLead, isEditing });
  
  const displayLead = isEditing ? editedLead as Lead : lead;
  
  return (
    <div className={cn(
      "mt-6",
      isFullScreen ? "max-w-7xl mx-auto px-4" : "space-y-6"
    )}>
      {!isEditing && (
        <LeadStatusUpdate 
          lead={lead}
          isUpdating={isUpdating}
          onStatusUpdate={onStatusUpdate}
        />
      )}
      
      <div className={cn(
        "grid gap-6",
        isFullScreen ? "grid-cols-2" : "grid-cols-1"
      )}>
        <div className="space-y-6">
          <ScoreBreakdown lead={lead} />
          
          <LeadIdentification 
            lead={displayLead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            renderField={renderField}
          />

          <LeadContact 
            lead={displayLead}
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
        </div>

        <div className="space-y-6">
          <LeadOnlinePresence 
            lead={displayLead}
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
            lead={displayLead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
          />

          <LeadScoringCriteria
            lead={displayLead}
            isEditing={isEditing}
            editedLead={editedLead}
            setEditedLead={setEditedLead}
            onAddTechnology={onAddTechnology}
          />
        </div>
      </div>

      {lead.domain_type === 'business' && (
        <>
          <div id="lead-analysis-section" className="lead-analysis-section mt-6">
            <LeadAnalysis lead={lead} />
          </div>
          <LeadDiscoveries leadId={lead.id} onLeadUpdate={() => window.location.reload()} />
        </>
      )}

      <div className={cn(
        "mt-6 grid gap-6",
        isFullScreen ? "grid-cols-2" : "grid-cols-1"
      )}>
        <ScoreHistory leadId={lead.id} />
        <ActivityLog leadId={lead.id} />
      </div>
    </div>
  );
};