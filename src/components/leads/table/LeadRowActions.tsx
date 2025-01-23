import { Button } from "@/components/ui/button";
import { Eye, Trash2, Copy, Phone } from "lucide-react";
import { Lead } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadRowActionsProps {
  lead: Lead;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadRowActions = ({ lead, isAdmin, onView, onDelete }: LeadRowActionsProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getPrimaryEmail = (emails: any[] | null) => {
    if (!emails || emails.length === 0) return null;
    return emails[0].email;
  };

  const getPrimaryPhone = (phones: string[] | null) => {
    if (!phones || phones.length === 0) return null;
    return phones[0];
  };

  const primaryEmail = getPrimaryEmail(lead.emails);
  const primaryPhone = getPrimaryPhone(lead.phone_numbers);

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onView(lead);
              }}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View lead details</p>
          </TooltipContent>
        </Tooltip>

        {primaryEmail && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(primaryEmail, "Email");
                }}
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy email</p>
            </TooltipContent>
          </Tooltip>
        )}

        {primaryPhone && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(primaryPhone, "Phone number");
                }}
                className="h-8 w-8"
              >
                <Phone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy phone number</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lead);
                }}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete lead</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default LeadRowActions;