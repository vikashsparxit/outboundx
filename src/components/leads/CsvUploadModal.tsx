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

const CsvUploadModal = ({ isOpen, onClose, onSuccess }: CsvUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
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
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop a CSV file",
        variant: "destructive",
      });
    }
  };

  const parseEmails = (emailsStr: string): EmailAddress[] => {
    if (!emailsStr) return [];
    try {
      const emailsList = emailsStr.split(',').map(email => email.trim());
      return emailsList.map((email, index) => {
        let type: "business" | "personal" | "other" = "other";
        if (index === 0) type = "business";
        else if (index === 1) type = "personal";
        return { type, email };
      });
    } catch (error) {
      console.error("Error parsing emails:", error);
      return [];
    }
  };

  const parsePhoneNumbers = (phoneStr: string): string[] => {
    if (!phoneStr) return [];
    try {
      return phoneStr.split(',').map(phone => phone.trim()).filter(phone => phone.length > 0);
    } catch (error) {
      console.error("Error parsing phone numbers:", error);
      return [];
    }
  };

  const validateAndTransformLead = (rawLead: any): Partial<Lead> => {
    console.log("Raw lead data:", rawLead);
    const transformedLead: Partial<Lead> = {};

    // Handle required fields with validation
    if (!rawLead.ticket_id || !rawLead.email) {
      console.warn("Missing required fields:", { ticket_id: rawLead.ticket_id, email: rawLead.email });
    }

    // Map and validate status
    const status = rawLead.status?.toLowerCase();
    if (status && ["new", "contacted", "in_progress", "closed_won", "closed_lost"].includes(status)) {
      transformedLead.status = status as LeadStatus;
    } else {
      transformedLead.status = "new";
      console.log("Invalid status, defaulting to 'new':", status);
    }

    // Transform phone numbers
    transformedLead.phone_numbers = parsePhoneNumbers(rawLead.phone_numbers);
    console.log("Parsed phone numbers:", transformedLead.phone_numbers);

    // Handle emails
    if (rawLead.email) {
      transformedLead.email = rawLead.email.split(',')[0]?.trim(); // Primary email
      transformedLead.emails = parseEmails(rawLead.email);
      console.log("Parsed emails:", transformedLead.emails);
    }

    // Convert numeric fields with validation
    transformedLead.bounce_count = Number(rawLead.bounce_count) || 0;
    transformedLead.call_count = Number(rawLead.call_count) || 0;

    // Handle boolean fields
    transformedLead.handled = rawLead.handled === 'true' || rawLead.handled === true;

    // Map all text fields with validation
    const textFields = [
      'ticket_id',
      'website',
      'contact_id',
      'domain',
      'subject',
      'message',
      'lead_type',
      'client_type',
      'country',
      'city',
      'state',
      'ip_country',
      'ip_region'
    ] as const;

    textFields.forEach(field => {
      if (rawLead[field] !== undefined && rawLead[field] !== null) {
        transformedLead[field] = String(rawLead[field]).trim();
      } else {
        console.log(`Field ${field} is missing or null`);
      }
    });

    console.log("Transformed lead:", transformedLead);
    return transformedLead;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const rawLeads = results.data as any[];
          console.log('CSV Headers:', Object.keys(rawLeads[0]));
          console.log('First row sample:', rawLeads[0]);

          const totalLeads = rawLeads.length;
          let uploadedCount = 0;
          let duplicateCount = 0;
          let errorCount = 0;

          for (const rawLead of rawLeads) {
            try {
              const transformedLead = validateAndTransformLead(rawLead);
              
              // Skip if missing required fields
              if (!transformedLead.ticket_id || !transformedLead.email) {
                console.warn("Skipping lead due to missing required fields:", rawLead);
                errorCount++;
                continue;
              }

              const databaseLead = convertToDatabaseLead(transformedLead);
              
              // Check for duplicates
              const { data: existingLeads } = await supabase
                .from("leads")
                .select("id")
                .eq("ticket_id", transformedLead.ticket_id)
                .eq("email", transformedLead.email)
                .limit(1);

              if (existingLeads && existingLeads.length > 0) {
                console.log('Duplicate lead found:', transformedLead);
                duplicateCount++;
                continue;
              }

              const { error } = await supabase.from("leads").insert([databaseLead]);
              
              if (error) {
                console.error('Error uploading lead:', error);
                errorCount++;
                throw error;
              }
              
              uploadedCount++;
              setProgress((uploadedCount / totalLeads) * 100);
            } catch (error) {
              console.error("Error processing lead:", error);
              errorCount++;
            }
          }

          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${uploadedCount} leads. ${duplicateCount} duplicates skipped. ${errorCount} errors.`,
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
      setProgress(0);
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