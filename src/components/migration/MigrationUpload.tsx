import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MigrationUploadProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const MigrationUpload = ({ isOpen, onClose }: MigrationUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const { data: migrationJob, isLoading: isLoadingJob } = useQuery({
    queryKey: ["migrationJob", jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const { data, error } = await supabase
        .from("migration_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });

  const isComplete = migrationJob?.status === "completed";
  const isFailed = migrationJob?.status === "failed";
  const progress = migrationJob 
    ? Math.round((migrationJob.processed_records / Math.max(migrationJob.total_records, 1)) * 100)
    : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await fetch("/api/migration/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setJobId(data.jobId);

      toast({
        title: "Upload successful",
        description: "Your file is being processed",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Data Migration</h2>
        <p className="text-muted-foreground">
          Upload your data file to begin the migration process
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.xlsx"
          disabled={isUploading}
        />
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>

      {jobId && !isLoadingJob && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {isComplete
                ? "Migration completed"
                : isFailed
                ? "Migration failed"
                : "Processing..."}
            </span>
            <span className="text-sm text-muted-foreground">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          {migrationJob?.error_log && migrationJob.error_log.length > 0 && (
            <p className="text-sm text-destructive">
              {Array.isArray(migrationJob.error_log) 
                ? migrationJob.error_log[0]
                : "An error occurred during migration"}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (isOpen !== undefined && onClose) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[95vw] sm:w-[680px] lg:w-[800px]">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return content;
};

export default MigrationUpload;