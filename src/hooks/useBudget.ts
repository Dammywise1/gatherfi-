import { useGatherFiProgram, findBudgetPDA, findContributorPDA, findVotePDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/contexts/ToastContext';

export const useBudget = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const submitBudget = async (eventPda: PublicKey, totalAmount: number) => {
    try {
      const program = getProgramWithSigner();
      const [budgetPda] = findBudgetPDA(eventPda);

      const tx = await program.methods
        .submitBudget(totalAmount)
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          budget: budgetPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Budget submitted successfully!');
      return { tx, budgetPda };
    } catch (err: any) {
      error(err.message || 'Failed to submit budget');
      throw err;
    }
  };

  const getBudget = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [budgetPda] = findBudgetPDA(eventPda);
      return await program.account.budget.fetch(budgetPda);
    } catch {
      return null;
    }
  };

  const voteOnBudget = async (eventPda: PublicKey, approve: boolean) => {
    try {
      const program = getProgramWithSigner();
      const [budgetPda] = findBudgetPDA(eventPda);
      const [contributorPda] = findContributorPDA(eventPda, program.provider.publicKey);
      const [votePda] = findVotePDA(eventPda, program.provider.publicKey);

      const tx = await program.methods
        .voteOnBudget(approve)
        .accounts({
          voter: program.provider.publicKey,
          event: eventPda,
          budget: budgetPda,
          contributor: contributorPda,
          vote: votePda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success(`Voted ${approve ? 'YES' : 'NO'} on budget!`);
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to vote');
      throw err;
    }
  };

  const getVote = async (eventPda: PublicKey, voter: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [votePda] = findVotePDA(eventPda, voter);
      return await program.account.vote.fetch(votePda);
    } catch {
      return null;
    }
  };

  return {
    submitBudget,
    getBudget,
    voteOnBudget,
    getVote
  };
};
