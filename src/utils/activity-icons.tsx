import { 
  ArrowUp, 
  ArrowDown,
  Edit,
  RefreshCcw,
  FileText,
  UserPlus,
  Clock,
  LucideIcon
} from "lucide-react";

interface Activity {
  activity_type: string;
  description: string;
}

export const getActivityIcon = (activity: Activity) => {
  const type = activity.activity_type;
  const description = activity.description.toLowerCase();

  if (type === 'beam_score_update') {
    if (description.includes('increased') || description.includes('from 0 to')) {
      return <ArrowUp className="flex-shrink-0 text-green-500" />;
    }
    return <ArrowDown className="flex-shrink-0 text-red-500" />;
  }

  if (type === 'lead_update' || description.includes('updated')) {
    return <Edit className="flex-shrink-0 text-blue-500" />;
  }

  if (type === 'status_update' || description.includes('status')) {
    return <RefreshCcw className="flex-shrink-0 text-orange-500" />;
  }

  if (type === 'note_added' || description.includes('note')) {
    return <FileText className="flex-shrink-0 text-purple-500" />;
  }

  if (type === 'lead_created' || description.includes('created')) {
    return <UserPlus className="flex-shrink-0 text-emerald-500" />;
  }

  return <Clock className="flex-shrink-0 text-muted-foreground" />;
};