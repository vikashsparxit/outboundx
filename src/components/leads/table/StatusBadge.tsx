interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants: Record<string, { bg: string; text: string; icon: JSX.Element }> = {
    new: {
      bg: "bg-blue-50 hover:bg-blue-100",
      text: "text-blue-700",
      icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
    },
    contacted: {
      bg: "bg-yellow-50 hover:bg-yellow-100",
      text: "text-yellow-700",
      icon: <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
    },
    in_progress: {
      bg: "bg-purple-50 hover:bg-purple-100",
      text: "text-purple-700",
      icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
    },
    closed_won: {
      bg: "bg-green-50 hover:bg-green-100",
      text: "text-green-700",
      icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
    },
    closed_lost: {
      bg: "bg-red-50 hover:bg-red-100",
      text: "text-red-700",
      icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
    }
  };

  const variant = variants[status] || variants.new;
  
  return (
    <div className={`inline-flex items-center px-2.5 py-1.5 rounded-full font-medium text-sm ${variant.bg} ${variant.text}`}>
      {variant.icon}
      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </div>
  );
};

export default StatusBadge;