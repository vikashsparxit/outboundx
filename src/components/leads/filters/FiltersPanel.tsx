import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { LeadStatus } from "@/types/lead";

export interface FilterConfig {
  status?: LeadStatus;
  beamScoreRange?: [number, number];
  companySize?: string;
  industryVertical?: string;
  assignedTo?: string;
  emailType?: string;
}

interface FiltersPanelProps {
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
  onClearFilters: () => void;
}

const FiltersPanel = ({ filters, onFilterChange, onClearFilters }: FiltersPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (status: LeadStatus) => {
    onFilterChange({ ...filters, status });
  };

  const handleBeamScoreChange = (value: number[]) => {
    onFilterChange({ ...filters, beamScoreRange: [value[0], value[1]] });
  };

  const handleCompanySizeChange = (size: string) => {
    onFilterChange({ ...filters, companySize: size });
  };

  const handleIndustryChange = (industry: string) => {
    onFilterChange({ ...filters, industryVertical: industry });
  };

  const handleEmailTypeChange = (type: string) => {
    onFilterChange({ ...filters, emailType: type });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined).length;
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Type</label>
              <Select
                value={filters.emailType}
                onValueChange={handleEmailTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">BEAM Score Range</label>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={filters.beamScoreRange}
                onValueChange={handleBeamScoreChange}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.beamScoreRange?.[0] ?? 0}</span>
                <span>{filters.beamScoreRange?.[1] ?? 100}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Size</label>
              <Select
                value={filters.companySize}
                onValueChange={handleCompanySizeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enterprise (1000+ employees)">Enterprise</SelectItem>
                  <SelectItem value="Mid-Market (100-999 employees)">Mid-Market</SelectItem>
                  <SelectItem value="Small Business (10-99 employees)">Small Business</SelectItem>
                  <SelectItem value="Startup (1-9 employees)">Startup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Select
                value={filters.industryVertical}
                onValueChange={handleIndustryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={onClearFilters}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, status: undefined })}
              />
            </Badge>
          )}
          {filters.emailType && (
            <Badge variant="secondary" className="gap-1">
              Email: {filters.emailType}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, emailType: undefined })}
              />
            </Badge>
          )}
          {filters.companySize && (
            <Badge variant="secondary" className="gap-1">
              Size: {filters.companySize.split(' ')[0]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, companySize: undefined })}
              />
            </Badge>
          )}
          {filters.industryVertical && (
            <Badge variant="secondary" className="gap-1">
              Industry: {filters.industryVertical}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, industryVertical: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;