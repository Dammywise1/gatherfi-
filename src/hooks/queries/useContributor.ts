'use client';

import { useQuery } from '@tanstack/react-query';
import { useGatherFiProgram } from '@/hooks/program/useGatherFiProgram';
import { GatherFiClient } from '@/lib/gatherfi';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export const useContributor = (eventPda?: PublicKey) => {
  const { program } = useGatherFiProgram();
  const { publicKey } = useWallet();

  const fetchContributor = async () => {
    if (!program || !publicKey || !eventPda) return null;
    const client = new GatherFiClient(program);
    return client.fetchContributor(eventPda, publicKey);
  };

  const {
    data: contributor,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['contributor', eventPda?.toString(), publicKey?.toString()],
    queryFn: fetchContributor,
    enabled: !!program && !!publicKey && !!eventPda,
  });

  return {
    contributor,
    isLoading,
    refetch,
  };
};
