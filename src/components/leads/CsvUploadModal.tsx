import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { Lead, LeadStatus, EmailAddress } from "@/types/lead";
import { convertToDatabaseLead } from "@/types/lead";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Note: This component is getting quite large (298 lines) and should be refactored.
// Consider splitting it into smaller components for better maintainability.
const CsvUploadModal = ({ isOpen, onClose, onSuccess }: CsvUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      resetCounters();
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      resetCounters();
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop a CSV file",
        variant: "destructive",
      });
    }
  };

  const resetCounters = () => {
    setDuplicateCount(0);
    setErrorCount(0);
    setSuccessCount(0);
    setProgress(0);
  };

  const validateRequiredFields = (lead: any) => {
    const requiredFields = ['ticket_id', 'email'];
    const missingFields = requiredFields.filter(field => !lead[field]);
    
    if (missingFields.length > 0) {
      console.warn(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const parseEmails = (emailsStr: string): EmailAddress[] => {
    if (!emailsStr) return [];
    try {
      return emailsStr.split(',').map((email, index) => {
        let type: "business" | "personal" | "other" = "other";
        if (index === 0) type = "business";
        else if (index === 1) type = "personal";
        return { type, email: email.trim() };
      });
    } catch (error) {
      console.error("Error parsing emails:", error);
      return [];
    }
  };

  const parsePhoneNumbers = (phoneStr: string): string[] => {
    if (!phoneStr) return [];
    try {
      return phoneStr.split(',')
        .map(phone => phone.trim())
        .filter(phone => phone.length > 0);
    } catch (error) {
      console.error("Error parsing phone numbers:", error);
      return [];
    }
  };

  const validateAndTransformLead = (rawLead: any): Partial<Lead> | null => {
    console.log("Validating lead data:", rawLead);
    
    if (!validateRequiredFields(rawLead)) {
      return null;
    }

    const transformedLead: Partial<Lead> = {};

    // Map and validate status
    const status = rawLead.status?.toLowerCase();
    transformedLead.status = (status && ["new", "contacted", "in_progress", "closed_won", "closed_lost"].includes(status))
      ? status as LeadStatus
      : "new";

    // Transform emails and phone numbers
    transformedLead.email = rawLead.email?.split(',')[0]?.trim(); // Primary email
    transformedLead.emails = parseEmails(rawLead.email);
    transformedLead.phone_numbers = parsePhoneNumbers(rawLead.phone_numbers);

    // Convert numeric fields
    transformedLead.bounce_count = Number(rawLead.bounce_count) || 0;
    transformedLead.call_count = Number(rawLead.call_count) || 0;

    // Handle boolean fields
    transformedLead.handled = rawLead.handled === 'true' || rawLead.handled === true;

    // Map text fields
    const textFields = [
      'ticket_id', 'website', 'contact_id', 'domain',
      'subject', 'message', 'lead_type', 'client_type',
      'country', 'city', 'state', 'ip_country', 'ip_region'
    ] as const;

    textFields.forEach(field => {
      if (rawLead[field] !== undefined && rawLead[field] !== null) {
        transformedLead[field] = String(rawLead[field]).trim();
      }
    });

    console.log("Transformed lead:", transformedLead);
    return transformedLead;
  };

  const checkDuplicate = async (lead: Partial<Lead>): Promise<boolean> => {
    if (!lead.ticket_id || !lead.email) return false;

    const { data: existingLeads } = await supabase
      .from("leads")
      .select("id")
      .eq("ticket_id", lead.ticket_id)
      .eq("email", lead.email)
      .limit(1);

    return existingLeads && existingLeads.length > 0;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    resetCounters();

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          console.log('CSV Headers:', Object.keys(results.data[0]));
          console.log('First row sample:', results.data[0]);

          const rawLeads = results.data as any[];
          const totalLeads = rawLeads.length;
          
          for (const rawLead of rawLeads) {
            try {
              const transformedLead = validateAndTransformLead(rawLead);
              
              if (!transformedLead) {
                console.warn("Invalid lead data:", rawLead);
                setErrorCount(prev => prev + 1);
                continue;
              }

              const isDuplicate = await checkDuplicate(transformedLead);
              if (isDuplicate) {
                console.log('Duplicate lead found:', transformedLead);
                setDuplicateCount(prev => prev + 1);
                continue;
              }

              const databaseLead = convertToDatabaseLead(transformedLead);
              const { error } = await supabase
                .from("leads")
                .insert([databaseLead]);
              
              if (error) {
                console.error('Error uploading lead:', error);
                setErrorCount(prev => prev + 1);
                continue;
              }
              
              setSuccessCount(prev => prev + 1);
            } catch (error) {
              console.error("Error processing lead:", error);
              setErrorCount(prev => prev + 1);
            }

            const progress = ((successCount + duplicateCount + errorCount) / totalLeads) * 100;
            setProgress(progress);
          }

          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${successCount} leads. ${duplicateCount} duplicates skipped. ${errorCount} errors.`,
          });
          onSuccess();
          onClose();
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Error parsing CSV",
            description: "Please check your file format",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast({
        title: "Error uploading CSV",
        description: "An error occurred while uploading",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Leads CSV</DialogTitle>
        </DialogHeader>
        <div
          className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {uploading && (
                <Progress value={progress} className="w-full h-2" />
              )}
              {(successCount > 0 || duplicateCount > 0 || errorCount > 0) && (
                <div className="text-sm space-y-1">
                  <p className="text-green-600">Successful: {successCount}</p>
                  <p className="text-yellow-600">Duplicates: {duplicateCount}</p>
                  <p className="text-red-600">Errors: {errorCount}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-500">
                Drag and drop your CSV file here, or click to browse
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadModal;