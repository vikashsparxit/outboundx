import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface MigrationUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

type MigrationJob = {
  id: string;
  filename: string;
  total_records: number;
  processed_records: number;
  failed_records: number;
  status: string;
  error_log: any[];
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  created_by: string | null;
}

export default function MigrationUpload({ isOpen, onClose }: MigrationUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Query for active migration job
  const { data: migrationJob } = useQuery<MigrationJob | null>({
    queryKey: ["migration-job"],
    queryFn: async () => {
      const { data } = await supabase
        .from("migration_jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    refetchInterval: (data) => {
      if (!data) return false;
      return data.status === "processing" ? 1000 : false;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("migrations")
        .upload(`migration_${Date.now()}.csv`, file);

      if (uploadError) throw uploadError;

      // Create migration job
      const { data: jobData, error: jobError } = await supabase
        .from("migration_jobs")
        .insert({
          filename: uploadData.path,
          total_records: 0, // Will be updated by the processing function
          status: "pending",
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Start processing
      const { error: processError } = await supabase.functions
        .invoke("process-migration", {
          body: { migrationId: jobData.id },
        });

      if (processError) throw processError;

      toast({
        title: "Migration started",
        description: "The file is being processed. You can monitor the progress here.",
      });
    } catch (error) {
      console.error("Migration error:", error);
      toast({
        title: "Error starting migration",
        description: error.message,
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
          <DialogTitle>Upload Migration File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {migrationJob?.status === "processing" ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Migration in progress...
              </p>
              <Progress 
                value={
                  migrationJob?.total_records > 0
                    ? (migrationJob.processed_records / migrationJob.total_records) * 100
                    : 0
                } 
              />
              <div className="text-sm">
                <p>Processed: {migrationJob?.processed_records ?? 0}</p>
                <p>Failed: {migrationJob?.failed_records ?? 0}</p>
                {migrationJob?.total_records > 0 && (
                  <p>Total: {migrationJob.total_records}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV file only</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <div className="text-sm">Selected file: {file.name}</div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading..." : "Start Migration"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}