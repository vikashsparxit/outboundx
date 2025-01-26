import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadTimeline } from "./LeadTimeline";
import { LeadStatusActionForm } from "./LeadStatusActionForm";
import { LeadNoteForm } from "./LeadNoteForm";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useState } from "react";

interface LeadInteractionsProps {
  leadId: string;
}

export const LeadInteractions = forwardRef<
  { setActiveTab: (tab: string) => void },
  LeadInteractionsProps
>(({ leadId }, ref) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("timeline");

  useImperativeHandle(ref, () => ({
    setActiveTab: (tab: string) => {
      console.log("Setting active tab to:", tab);
      setActiveTab(tab);
    },
  }));

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['lead-timeline', leadId] });
    // Return to timeline view after successful action
    setActiveTab("timeline");
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
            <LeadStatusActionForm leadId={leadId} onSuccess={handleSuccess} />
          </TabsContent>
          
          <TabsContent value="note">
            <LeadNoteForm leadId={leadId} onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

LeadInteractions.displayName = "LeadInteractions";