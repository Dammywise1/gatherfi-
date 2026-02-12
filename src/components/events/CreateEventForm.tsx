'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEvents } from '@/hooks/queries/useEvents';
import { TokenType, CreateEventFormData } from '@/types/gatherfi';
import { NIGERIAN_CITIES } from '@/lib/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

const eventSchema = z.object({
  eventId: z.number().min(1, 'Event ID is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetAmount: z.number().min(0.01, 'Target amount must be greater than 0'),
  ticketPrice: z.number().min(0, 'Ticket price must be 0 or greater'),
  maxTickets: z.number().min(1, 'Must allow at least 1 ticket'),
  location: z.string().refine(
    (loc) => NIGERIAN_CITIES.some(city => loc.toLowerCase().includes(city.toLowerCase())),
    'Must be a valid Nigerian city'
  ),
  eventDate: z.date().min(new Date(), 'Event date must be in the future'),
  acceptedTokens: z.array(z.enum(['SOL', 'USDC', 'USDT'])).min(1, 'Select at least one token'),
});

type EventFormData = z.infer<typeof eventSchema>;

export const CreateEventForm = () => {
  const { publicKey } = useWallet();
  const router = useRouter();
  const { createEvent, isCreating } = useEvents();
  const [selectedTokens, setSelectedTokens] = useState<TokenType[]>([TokenType.SOL]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventId: Math.floor(Date.now() / 1000),
      acceptedTokens: [TokenType.SOL],
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const toggleToken = (token: TokenType) => {
    setSelectedTokens(prev => {
      const newTokens = prev.includes(token)
        ? prev.filter(t => t !== token)
        : [...prev, token];
      setValue('acceptedTokens', newTokens);
      return newTokens;
    });
  };

  const onSubmit = async (data: EventFormData) => {
    if (!publicKey) return;

    const result = await createEvent({
      ...data,
      eventId: data.eventId,
      targetAmount: data.targetAmount * 1e9, // Convert to lamports
      ticketPrice: data.ticketPrice * 1e9,
      organizer: publicKey,
    });

    if (result.success) {
      router.push(ROUTES.ORGANIZER_DASHBOARD);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card-custom p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event ID</label>
            <input
              type="number"
              {...register('eventId', { valueAsNumber: true })}
              className="input-custom"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              {...register('name')}
              className="input-custom"
              placeholder="e.g., Lagos Tech Conference 2024"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-custom"
              placeholder="Describe your event, goals, and how the funds will be used..."
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location (Nigerian City)</label>
            <input
              type="text"
              {...register('location')}
              className="input-custom"
              placeholder="e.g., Lagos, Abuja, Port Harcourt"
              list="cities"
            />
            <datalist id="cities">
              {NIGERIAN_CITIES.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Date</label>
            <input
              type="datetime-local"
              {...register('eventDate', { valueAsDate: true })}
              className="input-custom"
              onChange={(e) => setValue('eventDate', new Date(e.target.value))}
            />
            {errors.eventDate && (
              <p className="text-sm text-red-500 mt-1">{errors.eventDate.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="card-custom p-6">
        <h2 className="text-xl font-semibold mb-4">Funding Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Amount (SOL)</label>
            <input
              type="number"
              step="0.01"
              {...register('targetAmount', { valueAsNumber: true })}
              className="input-custom"
              placeholder="e.g., 100"
            />
            {errors.targetAmount && (
              <p className="text-sm text-red-500 mt-1">{errors.targetAmount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ticket Price (SOL)</label>
            <input
              type="number"
              step="0.01"
              {...register('ticketPrice', { valueAsNumber: true })}
              className="input-custom"
              placeholder="e.g., 0.1"
            />
            {errors.ticketPrice && (
              <p className="text-sm text-red-500 mt-1">{errors.ticketPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Maximum Tickets</label>
            <input
              type="number"
              {...register('maxTickets', { valueAsNumber: true })}
              className="input-custom"
              placeholder="e.g., 1000"
            />
            {errors.maxTickets && (
              <p className="text-sm text-red-500 mt-1">{errors.maxTickets.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="card-custom p-6">
        <h2 className="text-xl font-semibold mb-4">Accepted Tokens</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select which currencies contributors can use
        </p>
        
        <div className="flex gap-4">
          {[TokenType.SOL, TokenType.USDC, TokenType.USDT].map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => toggleToken(token)}
              className={`px-4 py-2 rounded-md border transition-all ${
                selectedTokens.includes(token)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-accent'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
        {errors.acceptedTokens && (
          <p className="text-sm text-red-500 mt-1">{errors.acceptedTokens.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isCreating}
          className="btn-primary flex-1 py-3"
        >
          {isCreating ? 'Creating...' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-8"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
