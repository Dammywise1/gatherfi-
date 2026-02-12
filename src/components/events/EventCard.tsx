'use client';

import { Event } from '@/types/gatherfi';
import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { Calendar, MapPin, Users, Target, Ticket } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { formatDistanceToNow, format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const progress = (event.amountRaised / event.targetAmount) * 100;
  const daysLeft = Math.max(0, Math.floor((event.fundingDeadline - Date.now() / 1000) / 86400));
  
  const statusColors = {
    Draft: 'bg-gray-100 text-gray-800',
    Funding: 'bg-blue-100 text-blue-800',
    BudgetVoting: 'bg-yellow-100 text-yellow-800',
    Active: 'bg-green-100 text-green-800',
    Completed: 'bg-purple-100 text-purple-800',
    Cancelled: 'bg-red-100 text-red-800',
    Refunding: 'bg-orange-100 text-orange-800',
  };

  return (
    <Link href={ROUTES.EVENT_DETAILS(event.publicKey?.toString() || '')}>
      <div className="card-custom p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold line-clamp-1">{event.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
            {event.status}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(event.eventDate * 1000), 'PPP')}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Ticket className="h-4 w-4 mr-2" />
            {event.ticketsSold} / {event.maxTickets} tickets sold
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{event.amountRaised / 1e9} SOL raised</span>
            <span>Target: {event.targetAmount / 1e9} SOL</span>
          </div>
          {event.status === 'Funding' && (
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4 mr-2" />
              {daysLeft} days left
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
