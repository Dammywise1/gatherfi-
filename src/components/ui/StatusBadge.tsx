import { EventStatus } from '@/types/gatherfi';
import { EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from '@/utils/status';

export const StatusBadge = ({ status }: { status: EventStatus }) => {
  const label = EVENT_STATUS_LABELS[status as keyof typeof EVENT_STATUS_LABELS] || status;
  const color = EVENT_STATUS_COLORS[status as keyof typeof EVENT_STATUS_COLORS] || 'bg-gray-500';

  return (
    <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
      {label}
    </span>
  );
};
