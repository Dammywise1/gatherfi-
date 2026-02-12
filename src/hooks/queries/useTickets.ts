'use client';

import { useQuery } from '@tanstack/react-query';
import { useGatherFiProgram } from '@/hooks/program/useGatherFiProgram';
import { GatherFiClient } from '@/lib/gatherfi';
import { PublicKey } from '@solana/web3.js';

export const useTickets = (eventPda?: PublicKey) => {
  const { program } = useGatherFiProgram();

  const fetchTickets = async () => {
    if (!program || !eventPda) return [];
    const client = new GatherFiClient(program);
    return client.fetchTicketsForEvent(eventPda);
  };

  const {
    data: tickets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['tickets', eventPda?.toString()],
    queryFn: fetchTickets,
    enabled: !!program && !!eventPda,
  });

  return {
    tickets,
    isLoading,
    refetch,
  };
};
