import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadError {
  id: string;
  file_name: string;
  row_number: number;
  original_data: Record<string, any>;
  error_type: string;
  error_message: string;
  created_at: string;
}

const UploadErrors = () => {
  const { data: errors = [], isLoading } = useQuery({
    queryKey: ["uploadErrors"],
    queryFn: async () => {
      console.log("Fetching upload errors");
      const { data, error } = await supabase
        .from("upload_errors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching upload errors:", error);
        throw error;
      }

      return data as UploadError[];
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Errors</h1>
        <p className="text-muted-foreground">
          View and manage CSV upload errors
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">File Name</TableHead>
              <TableHead>Row</TableHead>
              <TableHead>Error Type</TableHead>
              <TableHead>Error Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error) => (
              <TableRow key={error.id}>
                <TableCell className="font-medium">{error.file_name}</TableCell>
                <TableCell>{error.row_number}</TableCell>
                <TableCell className="capitalize">{error.error_type}</TableCell>
                <TableCell>{error.error_message}</TableCell>
                <TableCell>
                  {format(new Date(error.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Toggle data</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <pre className="mt-2 whitespace-pre-wrap text-sm">
                        {JSON.stringify(error.original_data, null, 2)}
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            ))}
            {errors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No upload errors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UploadErrors;