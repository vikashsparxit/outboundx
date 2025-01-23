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
    <Badge variant={getVariant()} className="text-[10px] px-1 py-0">
      {type}
    </Badge>
  );
};

export default EmailTypeTag;