import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { PhoneCall, Mail, Calendar, FileText, Clock } from "lucide-react";

interface TimelineItem {
  id: string;
  type: 'note' | 'status_action';
  created_at: string;
  content?: string;
  action_type?: string;
  outcome?: string;
  notes?: string;
  duration_minutes?: number;
  user_name?: string;
}

interface LeadTimelineProps {
  leadId: string;
}

export const LeadTimeline = ({ leadId }: LeadTimelineProps) => {
  const { data: timelineItems, isLoading } = useQuery({
    queryKey: ['lead-timeline', leadId],
    queryFn: async () => {
      // Fetch both notes and status actions
      const [notesResponse, actionsResponse] = await Promise.all([
        supabase
          .from('lead_notes')
          .select('id, content, created_at, user_id, profiles(full_name)')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false }),
        supabase
          .from('lead_status_actions')
          .select('id, action_type, outcome, notes, duration_minutes, created_at, user_id, profiles(full_name)')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false })
      ]);

      const notes = (notesResponse.data || []).map(note => ({
        id: note.id,
        type: 'note' as const,
        created_at: note.created_at,
        content: note.content,
        user_name: note.profiles?.full_name
      }));

      const actions = (actionsResponse.data || []).map(action => ({
        id: action.id,
        type: 'status_action' as const,
        created_at: action.created_at,
        action_type: action.action_type,
        outcome: action.outcome,
        notes: action.notes,
        duration_minutes: action.duration_minutes,
        user_name: action.profiles?.full_name
      }));

      // Combine and sort by date
      return [...notes, ...actions].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'call':
        return <PhoneCall className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {timelineItems?.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="mt-1">
              {getIcon(item.type === 'note' ? 'note' : item.action_type || '')}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {item.type === 'note' ? 'Note' : item.action_type}
                </p>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {item.type === 'note' ? (
                <p className="text-sm">{item.content}</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Outcome: {item.outcome}</p>
                  {item.notes && <p className="text-sm">{item.notes}</p>}
                  {item.duration_minutes && (
                    <p className="text-sm">Duration: {item.duration_minutes} minutes</p>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">By {item.user_name}</p>
              <Separator className="mt-2" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};