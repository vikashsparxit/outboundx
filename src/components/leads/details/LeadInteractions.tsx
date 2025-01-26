import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadTimeline } from "./LeadTimeline";
import { LeadStatusActionForm } from "./LeadStatusActionForm";
import { LeadNoteForm } from "./LeadNoteForm";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useState, useRef } from "react";

interface LeadInteractionsProps {
  leadId: string;
}

export type ActionType = "call" | "email" | "meeting" | "proposal";

export const LeadInteractions = forwardRef<
  { 
    setActiveTab: (tab: string) => void;
    setActionType?: (type: ActionType) => void;
    focusNoteInput?: () => void;
  },
  LeadInteractionsProps
>(({ leadId }, ref) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedActionType, setSelectedActionType] = useState<ActionType | null>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    setActiveTab: (tab: string) => {
      console.log("Setting active tab to:", tab);
      setActiveTab(tab);
      
      // If switching to note tab, focus the textarea
      if (tab === "note") {
        setTimeout(() => {
          noteInputRef.current?.focus();
        }, 100);
      }
    },
    setActionType: (type: ActionType) => {
      console.log("Setting action type to:", type);
      setSelectedActionType(type);
    },
    focusNoteInput: () => {
      noteInputRef.current?.focus();
    }
  }));

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['lead-timeline', leadId] });
    // Return to timeline view after successful action
    setActiveTab("timeline");
    setSelectedActionType(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Interactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="action">Log Action</TabsTrigger>
            <TabsTrigger value="note">Add Note</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <LeadTimeline leadId={leadId} />
          </TabsContent>
          
          <TabsContent value="action">
            <LeadStatusActionForm 
              leadId={leadId} 
              onSuccess={handleSuccess} 
              initialActionType={selectedActionType}
            />
          </TabsContent>
          
          <TabsContent value="note">
            <LeadNoteForm 
              leadId={leadId} 
              onSuccess={handleSuccess}
              ref={noteInputRef}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

LeadInteractions.displayName = "LeadInteractions";