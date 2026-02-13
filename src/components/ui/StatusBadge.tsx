const STATUS_LABELS: Record<string, string> = {
  Draft: 'Draft',
  Funding: 'Funding',
  BudgetVoting: 'Budget Voting',
  Active: 'Active',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Refunding: 'Refunding',
  Failed: 'Failed'
};

const STATUS_COLORS: Record<string, string> = {
  Draft: 'bg-gray-500',
  Funding: 'bg-blue-500',
  BudgetVoting: 'bg-yellow-500',
  Active: 'bg-green-500',
  Completed: 'bg-purple-500',
  Cancelled: 'bg-red-500',
  Refunding: 'bg-orange-500',
  Failed: 'bg-red-700'
};

export const StatusBadge = ({ status }: { status: any }) => {
  let statusKey: string = 'Unknown';
  
  if (typeof status === 'string') {
    statusKey = status;
  } else if (status && typeof status === 'object') {
    statusKey = Object.keys(status)[0];
    statusKey = statusKey.charAt(0).toUpperCase() + statusKey.slice(1);
  }

  const label = STATUS_LABELS[statusKey] || statusKey;
  const color = STATUS_COLORS[statusKey] || 'bg-gray-500';

  return (
    <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
      {label}
    </span>
  );
};
