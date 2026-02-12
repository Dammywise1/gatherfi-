'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Navigation } from '@/components/layout/Navigation';
import { useEvents } from '@/hooks/queries/useEvents';
import { Calendar, DollarSign, Users, Ticket, TrendingUp, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

export default function OrganizerDashboard() {
  const { publicKey, connected } = useWallet();
  const { events, isLoading } = useEvents();
  const [organizerEvents, setOrganizerEvents] = useState([]);

  useEffect(() => {
    if (events && publicKey) {
      const filtered = events.filter(event => 
        event.organizer.toString() === publicKey.toString()
      );
      setOrganizerEvents(filtered);
    }
  }, [events, publicKey]);

  if (!connected) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Please connect your wallet</h1>
          <p className="text-muted-foreground">You need to connect your wallet to view your dashboard.</p>
        </div>
      </main>
    );
  }

  const totalRaised = organizerEvents.reduce((acc, event) => acc + event.amountRaised, 0);
  const totalTicketsSold = organizerEvents.reduce((acc, event) => acc + event.ticketsSold, 0);
  const activeEvents = organizerEvents.filter(e => e.status === 'Funding' || e.status === 'Active').length;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your events and track performance</p>
          </div>
          <Link href={ROUTES.CREATE_EVENT} className="btn-primary inline-flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Event
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">{organizerEvents.length}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Events</h3>
          </div>

          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">{activeEvents}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Active Events</h3>
          </div>

          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">{(totalRaised / 1e9).toFixed(2)}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Raised (SOL)</h3>
          </div>

          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <Ticket className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">{totalTicketsSold}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Tickets Sold</h3>
          </div>
        </div>

        {/* Events List */}
        <h2 className="text-2xl font-bold mb-6">Your Events</h2>
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : organizerEvents.length === 0 ? (
          <div className="card-custom p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">Create your first event to start raising funds</p>
            <Link href={ROUTES.CREATE_EVENT} className="btn-primary">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {organizerEvents.map((event) => (
              <Link 
                key={event.publicKey?.toString()} 
                href={ROUTES.EVENT_DETAILS(event.publicKey?.toString() || '')}
              >
                <div className="card-custom p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Raised: {(event.amountRaised / 1e9).toFixed(2)} / {(event.targetAmount / 1e9).toFixed(2)} SOL
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Ticket className="h-4 w-4 mr-1" />
                          Tickets: {event.ticketsSold}/{event.maxTickets}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'Funding' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'BudgetVoting' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'Active' ? 'bg-green-100 text-green-800' :
                        event.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
