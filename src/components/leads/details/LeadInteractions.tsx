import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadTimeline } from "./LeadTimeline";
import { LeadStatusActionForm } from "./LeadStatusActionForm";
import { LeadNoteForm } from "./LeadNoteForm";
import { useQueryClient } from "@tanstack/react-query";

interface LeadInteractionsProps {
  leadId: string;
}

export const LeadInteractions = ({ leadId }: LeadInteractionsProps) => {
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['lead-timeline', leadId] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Interactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="space-y-4">
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
};