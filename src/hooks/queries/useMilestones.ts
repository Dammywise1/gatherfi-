'use client';

import { useQuery } from '@tanstack/react-query';
import { useGatherFiProgram } from '@/hooks/program/useGatherFiProgram';
import { GatherFiClient } from '@/lib/gatherfi';
import { PublicKey } from '@solana/web3.js';

export const useMilestones = (eventPda?: PublicKey) => {
  const { program } = useGatherFiProgram();

  const fetchMilestones = async () => {
    if (!program || !eventPda) return [];
    const client = new GatherFiClient(program);
    return client.fetchMilestones(eventPda);
  };

  const {
    data: milestones = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['milestones', eventPda?.toString()],
    queryFn: fetchMilestones,
    enabled: !!program && !!eventPda,
  });

  return {
    milestones,
    isLoading,
    refetch,
  };
};
