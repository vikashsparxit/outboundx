import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Building, CheckCircle, Globe, Info, Mail, MapPin, Phone, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Lead, convertToDatabaseLead } from "@/types/lead";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      case 'country':
      case 'city':
      case 'state':
        return <MapPin className="h-4 w-4" />;
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

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'low':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const groupDiscoveries = (discoveries: Discovery[]) => {
    const groups: Record<string, Discovery[]> = {
      contact: [],
      company: [],
      location: [],
      other: [],
    };

    discoveries.forEach(discovery => {
      switch (discovery.field_name) {
        case 'email':
        case 'emails':
        case 'phone_numbers':
        case 'contact_person':
          groups.contact.push(discovery);
          break;
        case 'company_size':
        case 'industry_vertical':
        case 'website':
        case 'domains':
          groups.company.push(discovery);
          break;
        case 'country':
        case 'city':
        case 'state':
          groups.location.push(discovery);
          break;
        default:
          groups.other.push(discovery);
      }
    });

    return groups;
  };

  const handleApplyDiscovery = async (discovery: Discovery) => {
    try {
      console.log('Applying discovery:', discovery);
      
      const updatePayload: Partial<Lead> = {
        [discovery.field_name]: discovery.discovered_value,
      };

      const dbPayload = convertToDatabaseLead(updatePayload);
      console.log('Converted payload for database:', dbPayload);

      const { error: updateError } = await supabase
        .from('leads')
        .update(dbPayload)
        .eq('id', leadId);

      if (updateError) throw updateError;

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
    return <div className="p-4">Loading discoveries...</div>;
  }

  if (!discoveries || discoveries.length === 0) {
    return null;
  }

  const groupedDiscoveries = groupDiscoveries(discoveries);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5" />
        <h3 className="text-lg font-semibold">AI Discoveries</h3>
      </div>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-6">
          {Object.entries(groupedDiscoveries).map(([group, items]) => items.length > 0 && (
            <div key={group} className="space-y-3">
              <h4 className="font-medium capitalize text-gray-700">{group} Information</h4>
              <div className="space-y-3">
                {items.map((discovery) => (
                  <div
                    key={discovery.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                      discovery.applied ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="mt-1">{getIcon(discovery.field_name)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {discovery.field_name.replace(/_/g, ' ')}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getConfidenceColor(discovery.confidence_level)}`}
                              >
                                <span className="flex items-center gap-1">
                                  {getConfidenceIcon(discovery.confidence_level)}
                                  {discovery.confidence_level} confidence
                                </span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Discovery confidence level: {discovery.confidence_level}</p>
                              {discovery.source && <p>Source: {discovery.source}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                      {discovery.applied && discovery.applied_at && (
                        <p className="text-xs text-muted-foreground">
                          Applied on {format(new Date(discovery.applied_at), "PPp")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeadDiscoveries;