import { EventStatus } from '@/types/gatherfi';

export const EVENT_STATUS_LABELS: Record<keyof typeof EventStatus, string> = {
  Draft: 'Draft',
  Funding: 'Funding',
  BudgetVoting: 'Budget Voting',
  Active: 'Active',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Refunding: 'Refunding',
  Failed: 'Failed'
};

export const EVENT_STATUS_COLORS: Record<keyof typeof EventStatus, string> = {
  Draft: 'bg-gray-500',
  Funding: 'bg-blue-500',
  BudgetVoting: 'bg-yellow-500',
  Active: 'bg-green-500',
  Completed: 'bg-purple-500',
  Cancelled: 'bg-red-500',
  Refunding: 'bg-orange-500',
  Failed: 'bg-red-700'
};

export const EVENT_STATUS_STEPS = [
  'Funding',
  'BudgetVoting',
  'Active',
  'Completed'
];

export function getNextStatus(current: EventStatus): EventStatus | null {
  switch (current) {
    case EventStatus.Funding:
      return EventStatus.BudgetVoting;
    case EventStatus.BudgetVoting:
      return EventStatus.Active;
    case EventStatus.Active:
      return EventStatus.Completed;
    default:
      return null;
  }
}
