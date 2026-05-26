import { BookOpen } from "lucide-react";

export function ActivityItem({
  icon: Icon,
  title,
  meta
}: {
  icon: typeof BookOpen;
  title: string;
  meta: string;
}) {
  return (
    <div className="activity-item">
      <span>
        <Icon size={18} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{meta}</p>
      </div>
    </div>
  );
}

