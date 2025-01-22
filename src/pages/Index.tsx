import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Table as TableIcon,
  Upload,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc" as "asc" | "desc",
  });

  const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
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
      return data;
    },
  });

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    // TODO: Implement CSV upload logic
    setIsLoading(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const paginatedLeads = leads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-16">
        <SidebarProvider defaultOpen={true}>
          <Sidebar className="z-50">
            <SidebarHeader className="border-b border-border px-4 py-2">
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
                      <SidebarMenuButton tooltip="Dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Leads">
                        <TableIcon className="h-4 w-4" />
                        <span>Leads</span>
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
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("csvUpload")?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </Button>
                  <input
                    type="file"
                    id="csvUpload"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCsvUpload}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("ticket_id")}
                      >
                        Ticket ID {getSortIcon("ticket_id")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("website")}
                      >
                        Website {getSortIcon("website")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("email")}
                      >
                        Email {getSortIcon("email")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        Status {getSortIcon("status")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("created_at")}
                      >
                        Created At {getSortIcon("created_at")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingLeads ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Loading leads...
                        </TableCell>
                      </TableRow>
                    ) : paginatedLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No leads found. Upload some leads to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>{lead.ticket_id}</TableCell>
                          <TableCell>{lead.website}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.status}</TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {leads.length > 0 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Index;