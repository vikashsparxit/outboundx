import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadZoneProps {
  file: File | null;
  uploading: boolean;
  progress: number;
  successCount: number;
  duplicateCount: number;
  errorCount: number;
  onFileChange: (file: File | null) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const UploadZone = ({
  file,
  uploading,
  progress,
  successCount,
  duplicateCount,
  errorCount,
  onFileChange,
  onDrop,
}: UploadZoneProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div
      className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {file ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{file.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(null)}
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
  );
};

export default UploadZone;