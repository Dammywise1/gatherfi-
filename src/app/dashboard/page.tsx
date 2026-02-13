'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEvent } from '@/hooks/useEvent';
import { useTicket } from '@/hooks/useTicket';
import { EventCard } from '@/components/event/EventCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { getEventsByOrganizer } = useEvent();
  const { getUserTickets } = useTicket();
  
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchDashboard = useCallback(async () => {
    if (!publicKey) {
      setLoading(false);
      return;
    }
    
    if (fetchedRef.current) return;
    
    setLoading(true);
    try {
      const events = await getEventsByOrganizer(publicKey);
      const processedEvents = events.map((event: any) => ({
        publicKey: event.publicKey,
        account: event.account
      })).filter(Boolean);
      setMyEvents(processedEvents);
      
      const tickets = await getUserTickets(publicKey);
      const processedTickets = tickets.map((ticket: any) => ({
        publicKey: ticket.publicKey,
        account: ticket.account
      })).filter(Boolean);
      setMyTickets(processedTickets);
      
      fetchedRef.current = true;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [publicKey, getEventsByOrganizer, getUserTickets]);

  useEffect(() => {
    fetchedRef.current = false;
    fetchDashboard();
  }, [fetchDashboard]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Please connect your wallet</p>
        <Link href="/" className="text-blue-600">Browse Events →</Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Events ({myEvents.length})</h2>
        {myEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No events created yet</p>
            <Link href="/event/create" className="text-blue-600 mt-2 inline-block">Create Event</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map(({ publicKey, account }) => (
              <EventCard key={publicKey.toBase58()} event={account} eventPda={publicKey} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Tickets ({myTickets.length})</h2>
        {myTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No tickets purchased yet</p>
            <Link href="/" className="text-blue-600 mt-2 inline-block">Browse Events</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTickets.map(({ publicKey, account }) => (
              <div key={publicKey.toBase58()} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500">Ticket #{account.ticketNumber}</p>
                <p className="text-lg font-semibold">Event: {account.event.toBase58().slice(0, 8)}...</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                  account.checkedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {account.checkedIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
