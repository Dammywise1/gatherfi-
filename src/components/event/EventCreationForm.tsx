'use client';
import { useState } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { TokenType } from '@/utils/tokens';
import { validateNigerianCity, NIGERIAN_CITIES } from '@/utils/location';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export const EventCreationForm = () => {
  const { createEvent } = useEvent();
  const { publicKey } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    ticketPrice: '',
    maxTickets: '',
    location: '',
    eventDate: '',
    acceptedTokens: [] as TokenType[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    if (!validateNigerianCity(formData.location)) {
      alert(`Location must be a Nigerian city: ${NIGERIAN_CITIES.join(', ')}`);
      return;
    }

    if (formData.acceptedTokens.length === 0) {
      alert('Please select at least one accepted token');
      return;
    }

    setLoading(true);
    try {
      // Note: eventId parameter is now ignored in the hook - we use sequential IDs
      const dummyEventId = 0; // This will be ignored
      
      const targetAmount = Number(formData.targetAmount);
      const ticketPrice = Number(formData.ticketPrice);
      const maxTickets = Number(formData.maxTickets);
      const eventDateTimestamp = Math.floor(new Date(formData.eventDate).getTime() / 1000);

      const { eventPda } = await createEvent(
        dummyEventId, // This is ignored - hook uses sequential IDs
        formData.name,
        formData.description,
        targetAmount,
        ticketPrice,
        maxTickets,
        formData.location,
        eventDateTimestamp,
        formData.acceptedTokens
      );
      
      alert('Event created successfully!');
      router.push(`/event/${eventPda.toBase58()}`);
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  const toggleToken = (token: TokenType) => {
    setFormData(prev => ({
      ...prev,
      acceptedTokens: prev.acceptedTokens.includes(token)
        ? prev.acceptedTokens.filter(t => t !== token)
        : [...prev.acceptedTokens, token]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Solana Lagos Meetup 2026"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your event..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount (SOL) *
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="10.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Price (SOL) *
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Tickets *
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={formData.maxTickets}
              onChange={(e) => setFormData({...formData, maxTickets: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Nigerian City) *
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a city</option>
            {NIGERIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accepted Tokens * (Select at least one)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {Object.values(TokenType).map((token) => (
              <label
                key={token}
                className={`
                  flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${formData.acceptedTokens.includes(token) 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.acceptedTokens.includes(token)}
                  onChange={() => toggleToken(token)}
                />
                <span className="font-medium">{token}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={loading || !publicKey}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>

        {!publicKey && (
          <p className="text-center text-yellow-600 text-sm">
            Please connect your wallet to create an event
          </p>
        )}
      </form>
    </div>
  );
};
