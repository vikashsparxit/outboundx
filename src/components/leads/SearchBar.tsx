import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
  isLoading: boolean;
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onUploadClick,
  isLoading,
}: SearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
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
  );
};

export default SearchBar;