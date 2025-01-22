import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import type { Lead, LeadStatus } from "@/types/lead";

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

  const validateAndTransformLead = (rawLead: any): Partial<Lead> => {
    const transformedLead: Partial<Lead> = {};

    // Handle status with proper type checking
    const status = rawLead.status?.toLowerCase();
    if (status && ["new", "contacted", "in_progress", "closed_won", "closed_lost"].includes(status)) {
      transformedLead.status = status as LeadStatus;
    } else {
      transformedLead.status = "new";
    }

    // Transform phone_numbers to array
    if (rawLead.phone_numbers) {
      transformedLead.phone_numbers = typeof rawLead.phone_numbers === 'string' 
        ? rawLead.phone_numbers.split(',').map((phone: string) => phone.trim())
        : rawLead.phone_numbers;
    }

    // Convert numeric fields
    transformedLead.bounce_count = rawLead.bounce_count ? Number(rawLead.bounce_count) || 0 : 0;
    transformedLead.call_count = rawLead.call_count ? Number(rawLead.call_count) || 0 : 0;

    // Copy other fields
    const textFields = [
      'ticket_id',
      'website',
      'email',
      'domain',
      'subject',
      'message',
      'lead_type',
      'client_type',
      'country',
      'city',
      'state'
    ] as const;

    textFields.forEach(field => {
      if (rawLead[field] !== undefined) {
        transformedLead[field] = rawLead[field];
      }
    });

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
          const totalLeads = rawLeads.length;
          let uploadedCount = 0;

          for (const rawLead of rawLeads) {
            try {
              const transformedLead = validateAndTransformLead(rawLead);
              console.log('Uploading lead:', transformedLead);
              const { error } = await supabase.from("leads").insert([transformedLead]);
              
              if (error) {
                console.error('Error uploading lead:', error);
                throw error;
              }
              
              uploadedCount++;
              setProgress((uploadedCount / totalLeads) * 100);
            } catch (error) {
              console.error("Error uploading lead:", error);
            }
          }

          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${uploadedCount} leads`,
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