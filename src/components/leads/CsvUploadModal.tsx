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

  const validateAndTransformLead = (lead: any): Partial<Lead> => {
    // Ensure status is a valid LeadStatus
    const status = lead.status?.toLowerCase() as LeadStatus;
    if (status && !["new", "contacted", "in_progress", "closed_won", "closed_lost"].includes(status)) {
      lead.status = "new"; // Default to "new" if invalid status
    }

    // Transform phone_numbers to array if it exists
    if (lead.phone_numbers && typeof lead.phone_numbers === 'string') {
      lead.phone_numbers = lead.phone_numbers.split(',').map(phone => phone.trim());
    }

    // Convert numeric fields
    if (lead.bounce_count) lead.bounce_count = Number(lead.bounce_count) || 0;
    if (lead.call_count) lead.call_count = Number(lead.call_count) || 0;

    return lead;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const leads = results.data as any[];
          const totalLeads = leads.length;
          let uploadedCount = 0;

          for (const rawLead of leads) {
            try {
              const lead = validateAndTransformLead(rawLead);
              const { error } = await supabase.from("leads").insert([lead]);
              if (error) throw error;
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