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
import { LeadInteractions, ActionType } from "./LeadInteractions";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail, Calendar, FileText } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRef } from "react";

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
  const displayLead = isEditing ? editedLead as Lead : lead;
  const interactionsRef = useRef<{ 
    setActiveTab: (tab: string) => void;
    setActionType?: (type: ActionType) => void;
    focusNoteInput?: () => void;
  }>(null);

  // Quick Actions with Keyboard Shortcuts
  useHotkeys('ctrl+n', () => {
    interactionsRef.current?.setActiveTab("note");
    interactionsRef.current?.focusNoteInput?.();
  });

  useHotkeys('ctrl+c', () => {
    interactionsRef.current?.setActiveTab("action");
    interactionsRef.current?.setActionType?.("call");
  });

  const handleQuickAction = (type: "note" | ActionType) => {
    if (type === "note") {
      interactionsRef.current?.setActiveTab("note");
      interactionsRef.current?.focusNoteInput?.();
    } else {
      interactionsRef.current?.setActiveTab("action");
      interactionsRef.current?.setActionType?.(type);
    }
  };

  const QuickActions = () => (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleQuickAction("note")}
      >
        <MessageSquare className="w-4 h-4" /> Note
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleQuickAction("call")}
      >
        <Phone className="w-4 h-4" /> Call
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleQuickAction("email")}
      >
        <Mail className="w-4 h-4" /> Email
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleQuickAction("meeting")}
      >
        <Calendar className="w-4 h-4" /> Meeting
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handleQuickAction("proposal")}
      >
        <FileText className="w-4 h-4" /> Proposal
      </Button>
    </div>
  );

  return (
    <div className={cn(
      "mt-2",
      isFullScreen ? "max-w-7xl mx-auto pb-20" : "space-y-4"
    )}>
      <LeadStatusUpdate 
        lead={lead}
        isUpdating={isUpdating}
        onStatusUpdate={onStatusUpdate}
      />
      
      <div className={cn(
        "grid gap-4",
        isFullScreen ? "grid-cols-12" : "grid-cols-1"
      )}>
        {/* Primary Section - Left Column */}
        <div className={cn(
          "space-y-4",
          isFullScreen ? "col-span-8" : ""
        )}>
          <Card className="p-4">
            <QuickActions />
            <LeadInteractions 
              leadId={lead.id} 
              ref={interactionsRef}
            />
          </Card>

          {/* Score Breakdown - Moved above Contact Info */}
          <Card className="p-4">
            <ScoreBreakdown lead={lead} />
          </Card>

          {/* Lead Contact Info */}
          <Card className="p-4">
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
          </Card>
        </div>

        {/* Secondary & Tertiary Sections - Right Column */}
        <div className={cn(
          "space-y-4",
          isFullScreen ? "col-span-4" : ""
        )}>
          {/* Secondary Sections */}
          <Card className="p-4">
            <LeadIdentification 
              lead={displayLead}
              isEditing={isEditing}
              editedLead={editedLead}
              setEditedLead={setEditedLead}
              renderField={renderField}
            />
          </Card>

          <Card className="p-4">
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
          </Card>

          <Card className="p-4">
            <LeadLocation 
              lead={displayLead}
              isEditing={isEditing}
              editedLead={editedLead}
              setEditedLead={setEditedLead}
            />
          </Card>

          {/* Tertiary Sections - Collapsible */}
          <Card className="p-4">
            <LeadScoringCriteria
              lead={displayLead}
              isEditing={isEditing}
              editedLead={editedLead}
              setEditedLead={setEditedLead}
              onAddTechnology={onAddTechnology}
            />
          </Card>
        </div>
      </div>

      {/* Full Width Sections */}
      {lead.domain_type === 'business' && (
        <div className={cn("mt-6 space-y-6")}>
          <Card className="p-4">
            <LeadAnalysis lead={lead} />
          </Card>
          <Card className="p-4">
            <LeadDiscoveries leadId={lead.id} onLeadUpdate={() => window.location.reload()} />
          </Card>
        </div>
      )}

      <div className={cn(
        "mt-6 grid gap-6",
        isFullScreen ? "grid-cols-2" : "grid-cols-1"
      )}>
        <Card className="p-4">
          <ScoreHistory leadId={lead.id} />
        </Card>
        <Card className="p-4">
          <ActivityLog leadId={lead.id} />
        </Card>
      </div>
    </div>
  );
};
