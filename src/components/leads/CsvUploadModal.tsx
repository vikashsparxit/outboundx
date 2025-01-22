import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { convertToDatabaseLead } from "@/types/lead";
import UploadZone from "./csv-upload/UploadZone";
import { validateAndTransformLead } from "./csv-upload/leadValidation";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CsvUploadModal = ({ isOpen, onClose, onSuccess }: CsvUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const { toast } = useToast();

  const resetCounters = () => {
    setDuplicateCount(0);
    setErrorCount(0);
    setSuccessCount(0);
    setProgress(0);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      resetCounters();
    } else if (selectedFile) {
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

  const checkDuplicate = async (lead: any): Promise<boolean> => {
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
        <UploadZone
          file={file}
          uploading={uploading}
          progress={progress}
          successCount={successCount}
          duplicateCount={duplicateCount}
          errorCount={errorCount}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
        />
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