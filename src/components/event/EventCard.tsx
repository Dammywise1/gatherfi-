'use client';
import { Event } from '@/types/gatherfi';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatTokenAmount } from '@/utils/tokens';
import { formatDate, daysRemaining } from '@/utils/date';
import Link from 'next/link';
import { PublicKey } from '@solana/web3.js';

interface EventCardProps {
  event: Event;
  eventPda: PublicKey;
}

export const EventCard = ({ event, eventPda }: EventCardProps) => {
  const progress = (event.amountRaised / event.targetAmount) * 100;
  const daysLeft = daysRemaining(event.fundingDeadline);

  return (
    <Link href={`/event/${eventPda.toBase58()}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
          <StatusBadge status={event.status} />
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-3">
          <ProgressBar
            current={event.amountRaised}
            total={event.targetAmount}
            label={`${formatTokenAmount(event.amountRaised, event.acceptedTokens[0])} / ${formatTokenAmount(event.targetAmount, event.acceptedTokens[0])} raised`}
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {event.ticketsSold} / {event.maxTickets} tickets sold
            </span>
            <span className="text-gray-500">
              {daysLeft} days left
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500">
              📍 {event.location}
            </span>
            <span className="text-sm text-gray-500">
              📅 {formatDate(event.eventDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
