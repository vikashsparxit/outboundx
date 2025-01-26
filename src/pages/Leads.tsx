import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import LeadsTable from "@/components/leads/LeadsTable";
import SearchBar from "@/components/leads/SearchBar";
import LeadsPagination from "@/components/leads/LeadsPagination";
import CsvUploadModal from "@/components/leads/CsvUploadModal";
import LeadDetails from "@/components/leads/LeadDetails";
import { Lead, DatabaseLead } from "@/types/lead";
import { convertFromDatabase } from "@/types/lead";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 50;  // Changed from 10 to 50

const Leads = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc" as "asc" | "desc",
  });

  const { data: leads = [], isLoading: isLoadingLeads, error, refetch } = useQuery({
    queryKey: ["leads", searchTerm, sortConfig],
    queryFn: async () => {
      try {
        console.log("Fetching leads with search term:", searchTerm);
        let query = supabase
          .from("leads")
          .select("*")
          .order(sortConfig.key, { ascending: sortConfig.direction === "asc" });

        if (searchTerm) {
          query = query.or(
            `website.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,ticket_id.ilike.%${searchTerm}%`
          );
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching leads:", error);
          throw error;
        }

        if (!data) {
          return [];
        }

        return (data as DatabaseLead[]).map(convertFromDatabase);
      } catch (error) {
        console.error("Error in leads query:", error);
        toast.error("Failed to fetch leads. Please try again.");
        throw error;
      }
    },
    retry: 1,
  });

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const paginatedLeads = leads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) {
    console.error("Error in leads query:", error);
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">
            Manage and track all your leads
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onUploadClick={() => setIsCsvModalOpen(true)}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden bg-white">
        <div className="w-full overflow-x-auto">
          <LeadsTable
            leads={paginatedLeads}
            isLoading={isLoadingLeads}
            sortConfig={sortConfig}
            onSort={handleSort}
            onLeadSelect={setSelectedLead}
            onLeadDeleted={refetch}
          />
        </div>
      </div>

      {leads.length > 0 && (
        <div className="mt-4">
          <LeadsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      <LeadDetails
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onLeadUpdate={refetch}
      />
    </div>
  );
};

export default Leads;
