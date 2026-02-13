'use client';
import { useState } from 'react';
import { EventList } from '@/components/event/EventList';
import { EventStatus } from '@/types/gatherfi';

export default function Home() {
  const [filter, setFilter] = useState<EventStatus | undefined>(undefined);

  const filters = [
    { label: 'All', value: undefined },
    { label: 'Funding', value: EventStatus.Funding },
    { label: 'Active', value: EventStatus.Active },
    { label: 'Completed', value: EventStatus.Completed }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Events on Solana
        </h1>
        <p className="text-xl text-gray-600">
          Fund events, vote on budgets, and earn profits
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-md ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <EventList statusFilter={filter} />
    </div>
  );
}
