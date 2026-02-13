'use client';
import { useEffect, useState } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventStatus } from '@/types/gatherfi';

export const EventList = ({ statusFilter }: { statusFilter?: EventStatus }) => {
  const { getAllEvents, getEventsByStatus } = useEvent();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = statusFilter 
          ? await getEventsByStatus(statusFilter)
          : await getAllEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [statusFilter]);

  if (loading) return <LoadingSpinner />;

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(({ pubkey, account }) => (
        <EventCard key={pubkey.toBase58()} event={account} eventPda={pubkey} />
      ))}
    </div>
  );
};
