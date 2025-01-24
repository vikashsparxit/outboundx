import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Building, CheckCircle, Globe, Info, Mail, Phone, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Lead, convertToDatabaseLead } from "@/types/lead";

interface Discovery {
  id: string;
  field_name: string;
  discovered_value: string;
  confidence_level: 'high' | 'medium' | 'low';
  source: string | null;
  applied: boolean;
  applied_at: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

interface LeadDiscoveriesProps {
  leadId: string;
  onLeadUpdate: () => void;
}

const LeadDiscoveries = ({ leadId, onLeadUpdate }: LeadDiscoveriesProps) => {
  const { toast } = useToast();

  const { data: discoveries, isLoading, refetch } = useQuery({
    queryKey: ["discoveries", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_discoveries")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Discovery[];
    },
  });

  const getIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'email':
      case 'emails':
        return <Mail className="h-4 w-4" />;
      case 'phone_numbers':
        return <Phone className="h-4 w-4" />;
      case 'website':
      case 'domains':
        return <Globe className="h-4 w-4" />;
      case 'company_size':
      case 'industry_vertical':
        return <Building className="h-4 w-4" />;
      case 'contact_person':
        return <User className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleApplyDiscovery = async (discovery: Discovery) => {
    try {
      console.log('Applying discovery:', discovery);
      
      // Update the lead with the discovered value
      const updatePayload: Partial<Lead> = {
        [discovery.field_name]: discovery.discovered_value,
      };

      // Convert the lead data to database format before sending to Supabase
      const dbPayload = convertToDatabaseLead(updatePayload);
      console.log('Converted payload for database:', dbPayload);

      const { error: updateError } = await supabase
        .from('leads')
        .update(dbPayload)
        .eq('id', leadId);

      if (updateError) throw updateError;

      // Mark the discovery as applied
      const { error: discoveryError } = await supabase
        .from('lead_discoveries')
        .update({
          applied: true,
          applied_at: new Date().toISOString(),
        })
        .eq('id', discovery.id);

      if (discoveryError) throw discoveryError;

      toast({
        title: "Discovery applied",
        description: "The discovered information has been added to the lead.",
      });

      refetch();
      onLeadUpdate();
    } catch (error) {
      console.error('Error applying discovery:', error);
      toast({
        title: "Error",
        description: "Failed to apply the discovery. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading discoveries...</div>;
  }

  if (!discoveries || discoveries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5" />
        <h3 className="text-lg font-semibold">AI Discoveries</h3>
      </div>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {discoveries.map((discovery) => (
            <div
              key={discovery.id}
              className="flex items-start gap-3 rounded-lg border p-3 bg-white"
            >
              <div className="mt-1">{getIcon(discovery.field_name)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">
                    {discovery.field_name.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    {getConfidenceIcon(discovery.confidence_level)}
                    <Badge variant="secondary" className="text-xs">
                      {discovery.confidence_level} confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {discovery.discovered_value}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Discovered {format(new Date(discovery.created_at), "PPp")}</span>
                  {discovery.source && (
                    <>
                      <span>•</span>
                      <span>Source: {discovery.source}</span>
                    </>
                  )}
                </div>
                {!discovery.applied && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleApplyDiscovery(discovery)}
                  >
                    Apply Discovery
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeadDiscoveries;