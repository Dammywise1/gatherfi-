import { BN, Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import {
  GATHERFI_PROGRAM_ID,
  EVENT_SEED,
  ESCROW_SEED,
  CONTRIBUTOR_SEED,
  TICKET_SEED,
  BUDGET_SEED,
  MILESTONE_SEED,
  PROFIT_SEED,
  VOTE_SEED,
  DEVNET_USDC_MINT,
  DEVNET_USDT_MINT,
} from './constants';
import {
  Event,
  Contributor,
  Ticket,
  Milestone,
  TokenType,
  CreateEventFormData,
  TransactionResult,
} from '@/types/gatherfi';

export class GatherFiClient {
  constructor(private program: Program) {}

  // ===== EVENT INSTRUCTIONS =====
  async createEvent(
    organizer: PublicKey,
    data: CreateEventFormData
  ): Promise<TransactionResult> {
    try {
      const eventId = new BN(data.eventId);
      const [eventPda] = await PublicKey.findProgramAddress(
        [Buffer.from(EVENT_SEED), organizer.toBuffer(), eventId.toArrayLike(Buffer, 'le', 8)],
        this.program.programId
      );

      const [escrowPda] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_SEED), eventPda.toBuffer()],
        this.program.programId
      );

      const tx = await this.program.methods
        .createEvent(
          eventId,
          data.name,
          data.description,
          new BN(data.targetAmount),
          new BN(data.ticketPrice),
          data.maxTickets,
          data.location,
          new BN(Math.floor(data.eventDate.getTime() / 1000)),
          data.acceptedTokens
        )
        .accounts({
          organizer,
          event: eventPda,
          escrow: escrowPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { signature: tx, success: true };
    } catch (error) {
      console.error('Error creating event:', error);
      return { signature: '', success: false, error: error.message };
    }
  }

  async fetchEvent(eventPda: PublicKey): Promise<Event> {
    const event = await this.program.account.event.fetch(eventPda);
    return {
      ...event,
      publicKey: eventPda,
      eventId: event.eventId.toNumber(),
      targetAmount: event.targetAmount.toNumber(),
      amountRaised: event.amountRaised.toNumber(),
      ticketPrice: event.ticketPrice.toNumber(),
      ticketsSold: event.ticketsSold,
      maxTickets: event.maxTickets,
      eventDate: event.eventDate.toNumber(),
      fundingDeadline: event.fundingDeadline.toNumber(),
      totalVotes: event.totalVotes.toNumber(),
      yesVotes: event.yesVotes.toNumber(),
      noVotes: event.noVotes.toNumber(),
      platformFeeAmount: event.platformFeeAmount.toNumber(),
    };
  }

  async fetchAllEvents(): Promise<Event[]> {
    try {
      const events = await this.program.account.event.all();
      return events.map((event) => ({
        ...event.account,
        publicKey: event.publicKey,
        eventId: event.account.eventId.toNumber(),
        targetAmount: event.account.targetAmount.toNumber(),
        amountRaised: event.account.amountRaised.toNumber(),
        ticketPrice: event.account.ticketPrice.toNumber(),
        ticketsSold: event.account.ticketsSold,
        maxTickets: event.account.maxTickets,
        eventDate: event.account.eventDate.toNumber(),
        fundingDeadline: event.account.fundingDeadline.toNumber(),
        totalVotes: event.account.totalVotes.toNumber(),
        yesVotes: event.account.yesVotes.toNumber(),
        noVotes: event.account.noVotes.toNumber(),
        platformFeeAmount: event.account.platformFeeAmount.toNumber(),
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async fetchContributor(eventPda: PublicKey, contributor: PublicKey): Promise<Contributor | null> {
    try {
      const [contributorPda] = await PublicKey.findProgramAddress(
        [Buffer.from(CONTRIBUTOR_SEED), eventPda.toBuffer(), contributor.toBuffer()],
        this.program.programId
      );
      
      const contributorAccount = await this.program.account.contributor.fetch(contributorPda);
      return {
        ...contributorAccount,
        publicKey: contributorPda,
        amount: contributorAccount.amount.toNumber(),
        votingPower: contributorAccount.votingPower.toNumber(),
        profitsClaimed: contributorAccount.profitsClaimed.toNumber(),
      };
    } catch {
      return null;
    }
  }

  async fetchTicketsForEvent(eventPda: PublicKey): Promise<Ticket[]> {
    try {
      const tickets = await this.program.account.ticket.all([
        {
          memcmp: {
            offset: 8 + 32,
            bytes: eventPda.toBase58(),
          },
        },
      ]);
      
      return tickets.map((ticket) => ({
        ...ticket.account,
        publicKey: ticket.publicKey,
        ticketNumber: ticket.account.ticketNumber,
        pricePaid: ticket.account.pricePaid.toNumber(),
      }));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
  }

  async fetchMilestones(eventPda: PublicKey): Promise<Milestone[]> {
    try {
      const milestones = await this.program.account.milestone.all([
        {
          memcmp: {
            offset: 8,
            bytes: eventPda.toBase58(),
          },
        },
      ]);
      
      return milestones.map((milestone) => ({
        ...milestone.account,
        publicKey: milestone.publicKey,
        index: milestone.account.index,
        amount: milestone.account.amount.toNumber(),
        dueDate: milestone.account.dueDate.toNumber(),
        releaseDate: milestone.account.releaseDate ? milestone.account.releaseDate.toNumber() : null,
      }));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  }
}
