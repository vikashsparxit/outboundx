import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface ScoreHistory {
  id: string;
  created_at: string;
  previous_score: number;
  new_score: number;
  reason: string;
}

interface ScoreHistoryProps {
  leadId: string;
}

const ScoreHistory = ({ leadId }: ScoreHistoryProps) => {
  const [history, setHistory] = useState<ScoreHistory[]>([]);

  useEffect(() => {
    const fetchScoreHistory = async () => {
      const { data, error } = await supabase
        .from("lead_scoring_history")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching score history:", error);
        return;
      }

      setHistory(data);
    };

    fetchScoreHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("score_history_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "lead_scoring_history",
          filter: `lead_id=eq.${leadId}`,
        },
        (payload) => {
          setHistory((current) => [payload.new as ScoreHistory, ...current].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leadId]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Score Changes</h3>
      <div className="space-y-3">
        {history.map((item) => {
          const scoreDiff = item.new_score - item.previous_score;
          const isPositive = scoreDiff > 0;

          return (
            <div key={item.id} className="flex items-start space-x-3 p-2 rounded-lg bg-muted/50">
              <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">
                      Score changed from {item.previous_score} to {item.new_score}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {history.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No score changes recorded yet
          </p>
        )}
      </div>
    </Card>
  );
};

export default ScoreHistory;