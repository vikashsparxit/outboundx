import { useEffect } from "react";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { calculateBeamScore } from "@/utils/scoring";

interface LeadSubscriptionProps {
  lead: Lead | null;
  onLeadUpdate: () => void;
}

export const LeadSubscription = ({ lead, onLeadUpdate }: LeadSubscriptionProps) => {
  useEffect(() => {
    if (!lead) return;

    console.log('Setting up real-time subscription for lead:', lead.id);

    const channel = supabase
      .channel(`lead_${lead.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `id=eq.${lead.id}`,
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          const updatedLead = payload.new as Lead;
          if (
            payload.eventType === "UPDATE" &&
            (
              updatedLead.status !== (payload.old as Lead).status ||
              updatedLead.call_count !== (payload.old as Lead).call_count ||
              updatedLead.budget_range !== (payload.old as Lead).budget_range ||
              updatedLead.decision_maker_level !== (payload.old as Lead).decision_maker_level ||
              updatedLead.need_urgency !== (payload.old as Lead).need_urgency ||
              updatedLead.project_timeline !== (payload.old as Lead).project_timeline
            )
          ) {
            console.log('Recalculating BEAM score due to relevant changes');
            await calculateBeamScore(updatedLead);
          }
          onLeadUpdate();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription for lead:', lead.id);
      supabase.removeChannel(channel);
    };
  }, [lead, onLeadUpdate]);

  return null;
};