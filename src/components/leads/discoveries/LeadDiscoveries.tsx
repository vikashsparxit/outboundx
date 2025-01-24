import { useState } from "react";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeadDiscovery {
  id: string;
  lead_id: string;
  field_name: string;
  discovered_value: string;
  confidence_level: "high" | "medium" | "low";
  source: string;
  applied: boolean;
  applied_at: string | null;
  applied_by: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

interface LeadDiscoveriesProps {
  leadId: string;
  onLeadUpdate: () => void;
}

const LeadDiscoveries = ({ leadId, onLeadUpdate }: LeadDiscoveriesProps) => {
  const [discoveries, setDiscoveries] = useState<LeadDiscovery[]>([]);

  const fetchDiscoveries = async () => {
    const { data, error } = await supabase
      .from("lead_discoveries")
      .select("*")
      .eq("lead_id", leadId)
      .eq("applied", false);

    if (error) {
      console.error("Error fetching discoveries:", error);
      return;
    }

    setDiscoveries(data || []);
  };

  const handleApplyDiscovery = async (discovery: LeadDiscovery) => {
    try {
      // Convert the value based on field type
      let convertedValue = discovery.discovered_value;
      
      // Handle array fields
      if (discovery.field_name === "technology_stack") {
        // Split the comma-separated string and trim whitespace
        convertedValue = JSON.stringify(
          discovery.discovered_value.split(",").map(item => item.trim())
        );
      }

      console.log("Converted payload for database:", {
        [discovery.field_name]: convertedValue,
      });

      // Update the lead with the converted value
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          [discovery.field_name]: discovery.field_name === "technology_stack" 
            ? JSON.parse(convertedValue) 
            : convertedValue
        })
        .eq("id", leadId);

      if (updateError) {
        throw updateError;
      }

      // Mark discovery as applied
      const { error: discoveryError } = await supabase
        .from("lead_discoveries")
        .update({
          applied: true,
          applied_at: new Date().toISOString(),
          applied_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", discovery.id);

      if (discoveryError) {
        throw discoveryError;
      }

      toast.success("Discovery applied successfully");
      onLeadUpdate();
      await fetchDiscoveries();
    } catch (error) {
      console.error("Error applying discovery:", error);
      toast.error("Failed to apply discovery");
    }
  };

  // Fetch discoveries on mount
  useState(() => {
    fetchDiscoveries();
  });

  if (discoveries.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Discoveries</CardTitle>
        <CardDescription>
          New information discovered through AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discoveries.map((discovery) => (
            <div
              key={discovery.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">
                    {discovery.field_name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <Badge variant={
                    discovery.confidence_level === "high" ? "default" :
                    discovery.confidence_level === "medium" ? "secondary" : "outline"
                  }>
                    {discovery.confidence_level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {discovery.discovered_value}
                </p>
                <p className="text-xs text-muted-foreground">
                  Source: {discovery.source}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleApplyDiscovery(discovery)}
              >
                Apply
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadDiscoveries;