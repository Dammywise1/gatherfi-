'use client';

import { useEvents } from '@/hooks/queries/useEvents';
import { EventCard } from './EventCard';
import { Loader2 } from 'lucide-react';

export const EventsGrid = () => {
  const { events, isLoading } = useEvents();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-muted-foreground mt-2">
          Be the first to create an event on GatherFi!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.publicKey?.toString()} event={event} />
      ))}
    </div>
  );
};
