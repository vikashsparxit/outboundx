import { useState, useEffect } from "react";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Json } from "@/integrations/supabase/types";

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
  metadata: Json;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string | null;
}

interface LeadDiscoveriesProps {
  leadId: string;
  onLeadUpdate: () => void;
}

const LeadDiscoveries = ({ leadId, onLeadUpdate }: LeadDiscoveriesProps) => {
  const [discoveries, setDiscoveries] = useState<LeadDiscovery[]>([]);
  const [verificationNotes, setVerificationNotes] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(data?.role === 'admin' || data?.role === 'manager');
    }
  };

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

  const handleVerification = async (discoveryId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("lead_discoveries")
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verification_notes: verificationNotes[discoveryId] || null
        })
        .eq("id", discoveryId);

      if (error) throw error;

      toast.success(`Discovery ${status} successfully`);
      fetchDiscoveries();
      setVerificationNotes(prev => {
        const updated = { ...prev };
        delete updated[discoveryId];
        return updated;
      });
    } catch (error) {
      console.error(`Error ${status} discovery:`, error);
      toast.error(`Failed to ${status} discovery`);
    }
  };

  const handleApplyDiscovery = async (discovery: LeadDiscovery) => {
    try {
      console.log("Applying discovery:", discovery);
      
      let convertedValue: any = discovery.discovered_value;
      
      if (discovery.field_name === "technology_stack") {
        const techArray = discovery.discovered_value.split(",").map(item => item.trim());
        console.log("Converting technology stack to array:", techArray);
        convertedValue = techArray;
      }

      const updatePayload = {
        [discovery.field_name]: convertedValue
      };
      
      console.log("Update payload:", updatePayload);

      const { error: updateError } = await supabase
        .from("leads")
        .update(updatePayload)
        .eq("id", leadId);

      if (updateError) throw updateError;

      const { error: discoveryError } = await supabase
        .from("lead_discoveries")
        .update({
          applied: true,
          applied_at: new Date().toISOString(),
          applied_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", discovery.id);

      if (discoveryError) throw discoveryError;

      setDiscoveries(prevDiscoveries => 
        prevDiscoveries.filter(d => d.id !== discovery.id)
      );

      toast.success("Discovery applied successfully");
      onLeadUpdate();
    } catch (error) {
      console.error("Error applying discovery:", error);
      toast.error("Failed to apply discovery");
    }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchDiscoveries();
  }, [leadId]);

  if (discoveries.length === 0) return null;

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

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
              className="flex flex-col p-4 border rounded-lg space-y-4"
            >
              <div className="flex items-start justify-between">
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
                    {getVerificationStatusBadge(discovery.verification_status)}
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
                  disabled={discovery.verification_status === 'rejected'}
                >
                  Apply
                </Button>
              </div>

              {isAdmin && discovery.verification_status === 'pending' && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add verification notes..."
                    value={verificationNotes[discovery.id] || ''}
                    onChange={(e) => setVerificationNotes(prev => ({
                      ...prev,
                      [discovery.id]: e.target.value
                    }))}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleVerification(discovery.id, 'verified')}
                    >
                      <Check className="w-4 h-4 mr-1" /> Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleVerification(discovery.id, 'rejected')}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              )}

              {discovery.verification_notes && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Verification Notes:</p>
                  <p>{discovery.verification_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadDiscoveries;