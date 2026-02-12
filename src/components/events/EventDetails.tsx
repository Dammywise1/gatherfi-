'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEvents } from '@/hooks/queries/useEvents';
import { useContributor } from '@/hooks/queries/useContributor';
import { useTickets } from '@/hooks/queries/useTickets';
import { useMilestones } from '@/hooks/queries/useMilestones';
import { Event, TokenType } from '@/types/gatherfi';
import { Calendar, MapPin, Users, Target, Ticket, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

interface EventDetailsProps {
  eventPda: PublicKey;
}

export const EventDetails = ({ eventPda }: EventDetailsProps) => {
  const { connected, publicKey } = useWallet();
  const { fetchEvent } = useEvents();
  const { contributor } = useContributor(eventPda);
  const { tickets } = useTickets(eventPda);
  const { milestones } = useMilestones(eventPda);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributeAmount, setContributeAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.SOL);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await fetchEvent(eventPda);
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventPda, fetchEvent]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist.</p>
        <Link href={ROUTES.EVENTS} className="btn-primary">
          Browse Events
        </Link>
      </div>
    );
  }

  const progress = (event.amountRaised / event.targetAmount) * 100;
  const daysLeft = Math.max(0, Math.floor((event.fundingDeadline - Date.now() / 1000) / 86400));
  const isOrganizer = publicKey?.toString() === event.organizer.toString();
  const hasContributed = !!contributor;
  const userTickets = tickets.filter(t => t.owner.toString() === publicKey?.toString());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.status === 'Funding' ? 'bg-blue-100 text-blue-800' :
          event.status === 'BudgetVoting' ? 'bg-yellow-100 text-yellow-800' :
          event.status === 'Active' ? 'bg-green-100 text-green-800' :
          event.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
          event.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-custom p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-5 w-5 mr-3" />
                <span>{format(new Date(event.eventDate * 1000), 'PPPP')}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Ticket className="h-5 w-5 mr-3" />
                <span>{event.ticketsSold} / {event.maxTickets} tickets sold</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-5 w-5 mr-3" />
                <span>Ticket Price: {(event.ticketPrice / 1e9).toFixed(2)} SOL</span>
              </div>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="card-custom p-6">
            <h2 className="text-xl font-semibold mb-4">Funding Progress</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Raised</span>
                <span>{(event.amountRaised / 1e9).toFixed(2)} SOL / {(event.targetAmount / 1e9).toFixed(2)} SOL</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              {event.status === 'Funding' && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {daysLeft} days remaining
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="card-custom p-6">
              <h2 className="text-xl font-semibold mb-4">Milestones</h2>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.index} className="flex items-start justify-between p-4 bg-secondary/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Milestone {milestone.index + 1}</span>
                        {milestone.released ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Released</span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pending</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{milestone.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Amount: {(milestone.amount / 1e9).toFixed(2)} {milestone.tokenType} • 
                        Due: {format(new Date(milestone.dueDate * 1000), 'PPP')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Contribute Card */}
          {event.status === 'Funding' && (
            <div className="card-custom p-6">
              <h2 className="text-xl font-semibold mb-4">Contribute</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    className="input-custom"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Token</label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value as TokenType)}
                    className="input-custom"
                  >
                    {event.acceptedTokens.map((token) => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={!connected || !contributeAmount}
                  className="btn-primary w-full py-3"
                >
                  {!connected ? 'Connect Wallet' : 'Contribute'}
                </button>
              </div>
            </div>
          )}

          {/* Buy Ticket Card */}
          {event.status === 'Active' && (
            <div className="card-custom p-6">
              <h2 className="text-xl font-semibold mb-4">Buy Ticket</h2>
              <div className="space-y-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Ticket Price</p>
                  <p className="text-2xl font-bold">{(event.ticketPrice / 1e9).toFixed(2)} SOL</p>
                </div>
                <button
                  disabled={!connected}
                  className="btn-primary w-full py-3"
                >
                  {!connected ? 'Connect Wallet' : 'Buy Ticket'}
                </button>
              </div>
            </div>
          )}

          {/* Your Tickets */}
          {userTickets.length > 0 && (
            <div className="card-custom p-6">
              <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
              <div className="space-y-3">
                {userTickets.map((ticket) => (
                  <div key={ticket.ticketNumber} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Ticket #{ticket.ticketNumber}</span>
                      {ticket.checkedIn ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Checked In</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Not Checked In</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Actions */}
          {isOrganizer && (
            <div className="card-custom p-6">
              <h2 className="text-xl font-semibold mb-4">Organizer Actions</h2>
              <div className="space-y-3">
                {event.status === 'Funding' && event.amountRaised >= event.targetAmount && (
                  <button className="btn-primary w-full">
                    Finalize Funding
                  </button>
                )}
                {event.status === 'BudgetVoting' && (
                  <Link href={`/events/${eventPda.toString()}/submit-budget`} className="btn-primary w-full block text-center">
                    Submit Budget
                  </Link>
                )}
                {event.status === 'Active' && (
                  <>
                    <Link href={`/events/${eventPda.toString()}/add-milestone`} className="btn-outline w-full block text-center">
                      Add Milestone
                    </Link>
                    <button className="btn-outline w-full">
                      Check In Tickets
                    </button>
                  </>
                )}
                {event.status === 'Completed' && !event.budgetApproved && (
                  <Link href={`/events/${eventPda.toString()}/finalize`} className="btn-primary w-full block text-center">
                    Finalize Event
                  </Link>
                )}
                {event.status !== 'Completed' && event.status !== 'Cancelled' && (
                  <button className="btn-outline w-full text-red-600 hover:bg-red-50">
                    Cancel Event
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
