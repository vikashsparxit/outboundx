import { Badge } from "@/components/ui/badge";

interface EmailTypeTagProps {
  type: string;
}

const EmailTypeTag = ({ type }: EmailTypeTagProps) => {
  const getVariant = () => {
    switch (type.toLowerCase()) {
      case 'business':
        return 'default';
      case 'personal':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant()} className="mr-2 text-xs">
      {type}
    </Badge>
  );
};

export default EmailTypeTag;