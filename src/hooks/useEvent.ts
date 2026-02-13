import { useGatherFiProgram, findEventPDA, findEscrowPDA, findBudgetPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { EventStatus } from '@/types/gatherfi';

export const useEvent = () => {
  const { getProgramWithSigner, PROGRAM_ID } = useGatherFiProgram();
  const { success, error } = useToast();

  const createEvent = async (
    eventId: number,
    name: string,
    description: string,
    targetAmount: number,
    ticketPrice: number,
    maxTickets: number,
    location: string,
    eventDate: number,
    acceptedTokens: TokenType[]
  ) => {
    try {
      const program = getProgramWithSigner();
      const [eventPda] = findEventPDA(program.provider.publicKey, eventId);
      const [escrowPda] = findEscrowPDA(eventPda);

      const tx = await program.methods
        .createEvent(
          eventId,
          name,
          description,
          targetAmount,
          ticketPrice,
          maxTickets,
          location,
          eventDate,
          acceptedTokens
        )
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          escrow: escrowPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Event created successfully!');
      return { tx, eventPda, escrowPda };
    } catch (err: any) {
      error(err.message || 'Failed to create event');
      throw err;
    }
  };

  const getEvent = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      return await program.account.event.fetch(eventPda);
    } catch (err) {
      console.error('Error fetching event:', err);
      throw err;
    }
  };

  const updateEvent = async (
    eventPda: PublicKey,
    name?: string,
    description?: string,
    location?: string,
    eventDate?: number
  ) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .updateEvent(
          name ? name : null,
          description ? description : null,
          location ? location : null,
          eventDate ? eventDate : null
        )
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda
        })
        .rpc();

      success('Event updated successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to update event');
      throw err;
    }
  };

  const cancelEvent = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .cancelEvent()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda
        })
        .rpc();

      success('Event cancelled successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to cancel event');
      throw err;
    }
  };

  const finalizeFunding = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .finalizeFunding()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Funding finalized! Moving to budget voting.');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to finalize funding');
      throw err;
    }
  };

  const finalizeFundingFailure = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .finalizeFundingFailure()
        .accounts({
          caller: program.provider.publicKey,
          event: eventPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Event marked as failed');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to mark event as failed');
      throw err;
    }
  };

  const getAllEvents = async () => {
    try {
      const program = getProgramWithSigner();
      const events = await program.account.event.all();
      return events.sort((a, b) => b.account.eventId.cmp(a.account.eventId));
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  };

  const getEventsByOrganizer = async (organizer: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const events = await program.account.event.all([
        {
          memcmp: {
            offset: 8,
            bytes: organizer.toBase58()
          }
        }
      ]);
      return events;
    } catch (err) {
      console.error('Error fetching organizer events:', err);
      return [];
    }
  };

  const getEventsByStatus = async (status: EventStatus) => {
    try {
      const program = getProgramWithSigner();
      const events = await program.account.event.all();
      return events.filter(e => e.account.status === status);
    } catch (err) {
      console.error('Error fetching events by status:', err);
      return [];
    }
  };

  return {
    createEvent,
    getEvent,
    updateEvent,
    cancelEvent,
    finalizeFunding,
    finalizeFundingFailure,
    getAllEvents,
    getEventsByOrganizer,
    getEventsByStatus
  };
};
