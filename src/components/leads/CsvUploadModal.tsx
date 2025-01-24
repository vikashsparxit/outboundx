import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { convertToDatabaseLead, Lead } from "@/types/lead";
import UploadZone from "./csv-upload/UploadZone";
import { validateAndTransformLead } from "./csv-upload/leadValidation";
import FieldMapping from "./csv-upload/FieldMapping";
import { calculateBeamScore } from "@/utils/scoring";

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
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [showMapping, setShowMapping] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setDuplicateCount(0);
    setErrorCount(0);
    setSuccessCount(0);
    setProgress(0);
    setCsvHeaders([]);
    setMappings({});
    setShowMapping(false);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      resetState();
      
      // Parse CSV headers
      Papa.parse(selectedFile, {
        header: true,
        preview: 1,
        complete: (results) => {
          console.log('CSV Headers:', Object.keys(results.data[0]));
          setCsvHeaders(Object.keys(results.data[0]));
          setShowMapping(true);
        },
        error: (error) => {
          console.error("Error parsing CSV headers:", error);
          toast({
            title: "Error parsing CSV",
            description: "Could not read CSV headers",
            variant: "destructive",
          });
        },
      });
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
    handleFileChange(droppedFile);
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

  const handleMappingChange = (dbField: string, csvHeader: string) => {
    setMappings((prev) => ({
      ...prev,
      [dbField]: csvHeader,
    }));
  };

  const mapRowToLead = (row: any) => {
    const mappedData: any = {};
    Object.entries(mappings).forEach(([dbField, csvHeader]) => {
      if (csvHeader) {
        mappedData[dbField] = row[csvHeader];
      }
    });
    return mappedData;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setDuplicateCount(0);
    setErrorCount(0);
    setSuccessCount(0);

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          console.log('Parsing complete, processing rows...');
          const rawLeads = results.data as any[];
          const totalLeads = rawLeads.length;
          
          for (const rawRow of rawLeads) {
            try {
              const mappedLead = mapRowToLead(rawRow);
              const transformedLead = validateAndTransformLead(mappedLead);
              
              if (!transformedLead) {
                console.warn("Invalid lead data:", rawRow);
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
              const { data: insertedLead, error: insertError } = await supabase
                .from("leads")
                .insert([databaseLead])
                .select()
                .single();
              
              if (insertError) {
                console.error('Error uploading lead:', insertError);
                setErrorCount(prev => prev + 1);
                continue;
              }

              // Calculate BEAM score for the newly inserted lead
              if (insertedLead) {
                console.log('Calculating initial BEAM score for lead:', insertedLead.id);
                try {
                  // Cast the insertedLead to Lead type to ensure type safety
                  const typedLead = insertedLead as unknown as Lead;
                  await calculateBeamScore(typedLead);
                  console.log('BEAM score calculated successfully');
                } catch (scoreError) {
                  console.error('Error calculating BEAM score:', scoreError);
                  // Don't increment error count as the lead was still inserted successfully
                }
              }
              
              setSuccessCount(prev => prev + 1);
            } catch (error) {
              console.error("Error processing lead:", error);
              setErrorCount(prev => prev + 1);
            }

            const progress = ((successCount + duplicateCount + errorCount + 1) / totalLeads) * 100;
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
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Leads CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
          {showMapping && csvHeaders.length > 0 && (
            <FieldMapping
              csvHeaders={csvHeaders}
              mappings={mappings}
              onMappingChange={handleMappingChange}
            />
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading || (showMapping && Object.keys(mappings).length === 0)}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadModal;
