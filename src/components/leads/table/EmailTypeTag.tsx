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
    <Badge 
      variant={getVariant()} 
      className="text-[8px] px-2 py-0 h-3 inline-flex items-center w-fit"
    >
      {type}
    </Badge>
  );
};

export default EmailTypeTag;