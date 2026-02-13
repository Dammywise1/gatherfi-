'use client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatTokenAmount, getTokenTypeString } from '@/utils/tokens';
import { formatDate, daysRemaining } from '@/utils/date';
import Link from 'next/link';
import { PublicKey } from '@solana/web3.js';

export const EventCard = ({ event, eventPda }: { event: any; eventPda: PublicKey }) => {
  const name = event.name || 'Unnamed Event';
  const description = event.description || 'No description';
  const amountRaised = event.amountRaised || 0;
  const targetAmount = event.targetAmount || 0;
  const ticketsSold = event.ticketsSold || 0;
  const maxTickets = event.maxTickets || 0;
  const location = event.location || 'Location TBD';
  const eventDate = event.eventDate || Date.now() / 1000;
  const fundingDeadline = event.fundingDeadline || Date.now() / 1000 + 30 * 24 * 60 * 60;
  
  let acceptedTokens = ['SOL'];
  if (event.acceptedTokens && Array.isArray(event.acceptedTokens)) {
    acceptedTokens = event.acceptedTokens.map((t: any) => getTokenTypeString(t));
  }
  
  const progress = targetAmount > 0 ? (Number(amountRaised) / Number(targetAmount)) * 100 : 0;
  const daysLeft = daysRemaining(Number(fundingDeadline));

  return (
    <Link href={`/event/${eventPda.toBase58()}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <StatusBadge status={event.status} />
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-3">
          <ProgressBar
            current={Number(amountRaised)}
            total={Number(targetAmount)}
            label={`${formatTokenAmount(amountRaised, acceptedTokens[0])} / ${formatTokenAmount(targetAmount, acceptedTokens[0])} raised`}
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{ticketsSold} / {maxTickets} tickets sold</span>
            <span className="text-gray-500">{daysLeft} days left</span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500">📍 {location}</span>
            <span className="text-sm text-gray-500">📅 {formatDate(Number(eventDate))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
