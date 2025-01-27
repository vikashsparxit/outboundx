import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";
import FiltersPanel, { FilterConfig } from "./filters/FiltersPanel";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
  isLoading: boolean;
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
  onClearFilters: () => void;
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onUploadClick,
  isLoading,
  filters,
  onFilterChange,
  onClearFilters,
}: SearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search leads by email, phone, company..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <FiltersPanel
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
        <Button
          variant="outline"
          onClick={onUploadClick}
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;