'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import { useEvent } from '@/hooks/useEvent';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePlatform } from '@/hooks/usePlatform';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ContributionForm } from '@/components/event/ContributionForm';
import { BudgetVoting } from '@/components/budget/BudgetVoting';
import { MilestoneList } from '@/components/milestone/MilestoneList';
import { AddMilestoneForm } from '@/components/milestone/AddMilestoneForm';
import { TicketPurchase } from '@/components/tickets/TicketPurchase';
import { TicketCheckIn } from '@/components/tickets/TicketCheckIn';
import { ProfitClaim } from '@/components/profit/ProfitClaim';
import { formatTokenAmount, TokenType } from '@/utils/tokens';
import { formatDate, daysRemaining } from '@/utils/date';
import { EventStatus } from '@/types/gatherfi';

export default function EventDetailPage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const { getEvent, finalizeFunding, finalizeFundingFailure, cancelEvent } = useEvent();
  const { isAdmin } = usePlatform();
  const [event, setEvent] = useState<any>(null);
  const [eventPda, setEventPda] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (params.address) {
        const pda = new PublicKey(params.address as string);
        setEventPda(pda);
        const eventData = await getEvent(pda);
        setEvent(eventData);
        
        if (publicKey) {
          setIsOrganizer(eventData.organizer.equals(publicKey));
          const adminStatus = await isAdmin();
          setIsUserAdmin(adminStatus);
        }
      }
    };
    fetchEvent();
  }, [params.address, publicKey]);

  const handleFinalizeFunding = async () => {
    if (!eventPda) return;
    setLoading(true);
    try {
      await finalizeFunding(eventPda);
      const updated = await getEvent(eventPda);
      setEvent(updated);
    } catch (error) {
      console.error('Failed to finalize funding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeFailure = async () => {
    if (!eventPda) return;
    setLoading(true);
    try {
      await finalizeFundingFailure(eventPda);
      const updated = await getEvent(eventPda);
      setEvent(updated);
    } catch (error) {
      console.error('Failed to finalize failure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!eventPda) return;
    if (!confirm('Are you sure you want to cancel this event?')) return;
    setLoading(true);
    try {
      await cancelEvent(eventPda);
      const updated = await getEvent(eventPda);
      setEvent(updated);
    } catch (error) {
      console.error('Failed to cancel event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <div className="text-center py-12">Loading event...</div>;
  }

  const daysLeft = daysRemaining(event.fundingDeadline);
  const isDeadlinePassed = Date.now() / 1000 > event.fundingDeadline;
  const canFinalizeFunding = event.status === EventStatus.Funding && 
    event.amountRaised >= event.targetAmount;
  const canFinalizeFailure = event.status === EventStatus.Funding && 
    isDeadlinePassed && event.amountRaised < event.targetAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
            <StatusBadge status={event.status} />
          </div>
          {isOrganizer && event.status !== EventStatus.Completed && 
           event.status !== EventStatus.Cancelled && 
           event.status !== EventStatus.Failed && (
            <button
              onClick={handleCancelEvent}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              Cancel Event
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{event.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">📍 Location</p>
            <p className="font-medium">{event.location}</p>
          </div>
          <div>
            <p className="text-gray-500">📅 Event Date</p>
            <p className="font-medium">{formatDate(event.eventDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">🎫 Tickets</p>
            <p className="font-medium">{event.ticketsSold} / {event.maxTickets} sold</p>
          </div>
          <div>
            <p className="text-gray-500">⏰ Funding Deadline</p>
            <p className="font-medium">{daysLeft} days left</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-500 mb-2">Accepted Tokens</p>
          <div className="flex gap-2">
            {event.acceptedTokens.map((token: TokenType) => (
              <span key={token} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>

      {event.status === EventStatus.Funding && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Funding Progress</h2>
            <ProgressBar
              current={event.amountRaised}
              total={event.targetAmount}
              label={`${formatTokenAmount(event.amountRaised, event.acceptedTokens[0])} / ${formatTokenAmount(event.targetAmount, event.acceptedTokens[0])} raised`}
            />
            
            {(canFinalizeFunding || canFinalizeFailure) && isOrganizer && (
              <div className="mt-4 flex gap-4">
                {canFinalizeFunding && (
                  <button
                    onClick={handleFinalizeFunding}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Finalize Funding
                  </button>
                )}
                {canFinalizeFailure && (
                  <button
                    onClick={handleFinalizeFailure}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Mark as Failed
                  </button>
                )}
              </div>
            )}
          </div>
          <ContributionForm
            eventPda={eventPda!}
            acceptedTokens={event.acceptedTokens}
            targetAmount={event.targetAmount}
            amountRaised={event.amountRaised}
          />
        </>
      )}

      {event.status === EventStatus.BudgetVoting && (
        <BudgetVoting eventPda={eventPda!} event={event} />
      )}

      {event.status === EventStatus.Active && (
        <>
          <TicketPurchase eventPda={eventPda!} event={event} />
          
          {isOrganizer && (
            <>
              <AddMilestoneForm
                eventPda={eventPda!}
                acceptedTokens={event.acceptedTokens}
                onSuccess={async () => {
                  const updated = await getEvent(eventPda!);
                  setEvent(updated);
                }}
              />
              <TicketCheckIn eventPda={eventPda!} />
            </>
          )}
          
          <MilestoneList
            eventPda={eventPda!}
            event={event}
            isOrganizer={isOrganizer}
          />
        </>
      )}

      {event.status === EventStatus.Completed && (
        <ProfitClaim
          eventPda={eventPda!}
          event={event}
          isOrganizer={isOrganizer}
        />
      )}

      {(event.status === EventStatus.Failed || event.status === EventStatus.Cancelled) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            {event.status === EventStatus.Failed ? 'Funding Failed' : 'Event Cancelled'}
          </h2>
          <p className="text-gray-700 mb-4">
            {event.status === EventStatus.Failed 
              ? 'This event did not reach its funding goal. Contributors can claim refunds.'
              : 'This event has been cancelled. Contributors can claim refunds.'}
          </p>
        </div>
      )}
    </div>
  );
}
