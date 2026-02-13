'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTicket } from '@/hooks/useTicket';
import { useEvent } from '@/hooks/useEvent';
import { PublicKey } from '@solana/web3.js';
import QRCode from 'react-qr-code';

export default function MyTicketsPage() {
  const { publicKey } = useWallet();
  const { getUserTickets } = useTicket();
  const { getEvent } = useEvent();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const userTickets = await getUserTickets(publicKey);
        setTickets(userTickets);
        
        const eventMap: Record<string, any> = {};
        for (const ticket of userTickets) {
          if (!eventMap[ticket.account.event.toBase58()]) {
            const eventData = await getEvent(ticket.account.event);
            eventMap[ticket.account.event.toBase58()] = eventData;
          }
        }
        setEvents(eventMap);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view tickets</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading your tickets...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You don't have any tickets yet</p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Browse Events →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map(({ pubkey, account }) => {
            const event = events[account.event.toBase58()];
            const ticketData = JSON.stringify({
              ticketNumber: account.ticketNumber,
              event: account.event.toBase58(),
              owner: account.owner.toBase58()
            });

            return (
              <div key={pubkey.toBase58()} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event?.name || 'Event'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Ticket #{account.ticketNumber}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      account.checkedIn 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {account.checkedIn ? 'Checked In' : 'Active'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {event?.location || 'Location TBD'}</p>
                    <p>📅 {event?.eventDate ? new Date(event.eventDate * 1000).toLocaleDateString() : 'Date TBD'}</p>
                    <p>💰 Paid: {account.pricePaid} {account.tokenType}</p>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(selectedTicket === pubkey ? null : pubkey)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {selectedTicket === pubkey ? 'Hide QR Code' : 'Show QR Code'}
                  </button>

                  {selectedTicket === pubkey && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <QRCode value={ticketData} size={200} />
                      </div>
                      <p className="text-xs text-center text-gray-500">
                        Show this QR code at the event entrance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
