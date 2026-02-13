'use client';
import { useEffect, useState } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventStatus } from '@/types/gatherfi';

interface EventData {
  publicKey: any;
  account: any;
}

export const EventList = ({ statusFilter }: { statusFilter?: EventStatus }) => {
  const { getAllEvents, getEventsByStatus } = useEvent();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = statusFilter 
          ? await getEventsByStatus(statusFilter)
          : await getAllEvents();
        
        // Handle different possible data structures
        let processedEvents: EventData[] = [];
        
        if (Array.isArray(fetchedEvents)) {
          processedEvents = fetchedEvents
            .map(event => {
              // Handle both {pubkey, account} and {publicKey, account} formats
              const publicKey = event.publicKey || event.pubkey;
              const account = event.account;
              
              if (publicKey && account) {
                return { publicKey, account };
              }
              return null;
            })
            .filter(Boolean) as EventData[];
        }
        
        setEvents(processedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [statusFilter, getAllEvents, getEventsByStatus]);

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
      {events.map(({ publicKey, account }) => (
        <EventCard key={publicKey.toBase58()} event={account} eventPda={publicKey} />
      ))}
    </div>
  );
};
