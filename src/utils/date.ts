import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

export function formatTimestamp(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'PPP p');
}

export function formatDate(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'PPP');
}

export function daysRemaining(timestamp: number): number {
  const now = Date.now() / 1000;
  if (now > timestamp) return 0;
  return Math.ceil((timestamp - now) / (24 * 60 * 60));
}
