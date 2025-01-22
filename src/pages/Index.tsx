import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Table as TableIcon, ListChecks } from "lucide-react";
import LeadsTable from "@/components/leads/LeadsTable";
import SearchBar from "@/components/leads/SearchBar";
import LeadsPagination from "@/components/leads/LeadsPagination";
import CsvUploadModal from "@/components/leads/CsvUploadModal";
import LeadDetails from "@/components/leads/LeadDetails";
import { Lead, DatabaseLead } from "@/types/lead";
import { convertFromDatabase } from "@/types/lead";
import { useNavigate, useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc" as "asc" | "desc",
  });

  const { data: leads = [], isLoading: isLoadingLeads, refetch } = useQuery({
    queryKey: ["leads", searchTerm, sortConfig],
    queryFn: async () => {
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
      if (error) throw error;
      return (data as DatabaseLead[]).map(convertFromDatabase);
    },
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-16">
        <SidebarProvider defaultOpen={true}>
          <Sidebar className="z-50">
            <SidebarHeader className="border-b border-border px-4 py-2 mt-[50px]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sales Dashboard</h2>
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        tooltip="Dashboard"
                        onClick={() => navigate("/")}
                        isActive={location.pathname === "/"}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        tooltip="Leads"
                        onClick={() => navigate("/leads")}
                        isActive={location.pathname === "/leads"}
                      >
                        <TableIcon className="h-4 w-4" />
                        <span>Leads</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        tooltip="Activity Log"
                        onClick={() => navigate("/activity-log")}
                        isActive={location.pathname === "/activity-log"}
                      >
                        <ListChecks className="h-4 w-4" />
                        <span>Activity Log</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Leads Management</h1>
                  <p className="text-muted-foreground">
                    Manage and track all your leads
                  </p>
                </div>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onUploadClick={() => setIsCsvModalOpen(true)}
                  isLoading={isLoading}
                />
              </div>

              <div className="rounded-md border">
                <LeadsTable
                  leads={paginatedLeads}
                  isLoading={isLoadingLeads}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onLeadSelect={setSelectedLead}
                  onLeadDeleted={refetch}
                />
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
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Index;