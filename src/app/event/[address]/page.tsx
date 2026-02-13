'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import { useEvent } from '@/hooks/useEvent';
import { useWallet } from '@solana/wallet-adapter-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ContributionForm } from '@/components/event/ContributionForm';
import { formatTokenAmount, getTokenTypeString } from '@/utils/tokens';
import { formatDate, daysRemaining } from '@/utils/date';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EventDetailPage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const { getEvent } = useEvent();
  
  const [event, setEvent] = useState<any>(null);
  const [eventPda, setEventPda] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const fetchedRef = useRef(false);

  // Memoize the fetch function to prevent recreating on each render
  const fetchEvent = useCallback(async () => {
    if (!params.address || fetchedRef.current) return;
    
    try {
      const pda = new PublicKey(params.address as string);
      setEventPda(pda);
      const eventData = await getEvent(pda);
      setEvent(eventData);
      
      if (publicKey && eventData) {
        setIsOrganizer(eventData.organizer.equals(publicKey));
      }
      
      fetchedRef.current = true;
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }, [params.address, publicKey, getEvent]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="text-center py-12">Event not found</div>;

  const acceptedTokens = event.acceptedTokens?.map((t: any) => getTokenTypeString(t)) || ['SOL'];
  const daysLeft = daysRemaining(Number(event.fundingDeadline || 0));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
            <StatusBadge status={event.status} />
          </div>
          {isOrganizer && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Organizer
            </span>
          )}
        </div>
        <p className="text-gray-700 mb-4">{event.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-gray-500">📍 Location</p><p className="font-medium">{event.location || 'TBD'}</p></div>
          <div><p className="text-gray-500">📅 Event Date</p><p className="font-medium">{event.eventDate ? formatDate(Number(event.eventDate)) : 'TBD'}</p></div>
          <div><p className="text-gray-500">🎫 Tickets</p><p className="font-medium">{event.ticketsSold || 0} / {event.maxTickets || 0} sold</p></div>
          <div><p className="text-gray-500">⏰ Funding Deadline</p><p className="font-medium">{daysLeft} days left</p></div>
        </div>

        <div className="mt-4">
          <p className="text-gray-500 mb-2">Accepted Tokens</p>
          <div className="flex gap-2">
            {acceptedTokens.map((token: string) => (
              <span key={token} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>

      {event.status === 'Funding' && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Funding Progress</h2>
            <ProgressBar
              current={Number(event.amountRaised || 0)}
              total={Number(event.targetAmount || 0)}
              label={`${formatTokenAmount(event.amountRaised || 0, acceptedTokens[0])} / ${formatTokenAmount(event.targetAmount || 0, acceptedTokens[0])} raised`}
            />
          </div>
          <ContributionForm
            eventPda={eventPda!}
            acceptedTokens={acceptedTokens}
            targetAmount={Number(event.targetAmount || 0)}
            amountRaised={Number(event.amountRaised || 0)}
          />
        </>
      )}
    </div>
  );
}
