'use client';

import { Navigation } from '@/components/layout/Navigation';
import { EventsGrid } from '@/components/events/EventsGrid';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Browse Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover and contribute to amazing events
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-custom pl-9"
              />
            </div>
            <button className="btn-outline p-2">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <EventsGrid />
      </div>
    </main>
  );
}
