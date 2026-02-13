'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEvent } from '@/hooks/useEvent';
import { useTicket } from '@/hooks/useTicket';
import { EventCard } from '@/components/event/EventCard';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { getEventsByOrganizer } = useEvent();
  const { getUserTickets } = useTicket();
  
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const events = await getEventsByOrganizer(publicKey);
        setMyEvents(events);
        
        const tickets = await getUserTickets(publicKey);
        setMyTickets(tickets);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view dashboard</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Events</h2>
        {myEvents.length === 0 ? (
          <p className="text-gray-500">You haven't created any events yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map(({ pubkey, account }) => (
              <EventCard key={pubkey.toBase58()} event={account} eventPda={pubkey} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
        {myTickets.length === 0 ? (
          <p className="text-gray-500">You haven't purchased any tickets yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTickets.map(({ pubkey, account }) => (
              <div key={pubkey.toBase58()} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket #{account.ticketNumber}</p>
                    <p className="text-lg font-semibold">Event: {account.event.toBase58().slice(0, 8)}...</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    account.checkedIn 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {account.checkedIn ? 'Checked In' : 'Not Checked In'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Price: {account.pricePaid} {account.tokenType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
