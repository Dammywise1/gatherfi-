'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGatherFiProgram } from '@/hooks/program/useGatherFiProgram';
import { GatherFiClient } from '@/lib/gatherfi';
import { Event, CreateEventFormData, TransactionResult } from '@/types/gatherfi';
import { PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';

export const useEvents = () => {
  const { program } = useGatherFiProgram();
  const queryClient = useQueryClient();

  const fetchEvents = async (): Promise<Event[]> => {
    if (!program) {
      console.warn('Program not initialized');
      return [];
    }
    const client = new GatherFiClient(program);
    return client.fetchAllEvents();
  };

  const fetchEvent = async (eventPda: PublicKey): Promise<Event | null> => {
    if (!program) return null;
    const client = new GatherFiClient(program);
    return client.fetchEvent(eventPda);
  };

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!program,
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormData & { organizer: PublicKey }) => {
      if (!program) throw new Error('Program not initialized');
      const client = new GatherFiClient(program);
      return client.createEvent(data.organizer, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Event created successfully!');
        queryClient.invalidateQueries({ queryKey: ['events'] });
      } else {
        toast.error(result.error || 'Failed to create event');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    events,
    isLoading,
    error,
    refetch,
    fetchEvent,
    createEvent: createEventMutation.mutateAsync,
    isCreating: createEventMutation.isPending,
  };
};
