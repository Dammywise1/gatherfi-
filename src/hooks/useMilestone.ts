import { useGatherFiProgram, findMilestonePDA, findEscrowPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType, getTokenAccount } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { TOKEN_MINTS } from '@/utils/tokens';

export const useMilestone = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const addMilestone = async (
    eventPda: PublicKey,
    milestoneIndex: number,
    description: string,
    amount: number,
    dueDate: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [milestonePda] = findMilestonePDA(eventPda, milestoneIndex);

      const tx = await program.methods
        .addMilestone(
          milestoneIndex,
          description,
          amount,
          dueDate,
          tokenType
        )
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          milestone: milestonePda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Milestone added successfully!');
      return { tx, milestonePda };
    } catch (err: any) {
      error(err.message || 'Failed to add milestone');
      throw err;
    }
  };

  const releaseMilestone = async (
    eventPda: PublicKey,
    milestoneIndex: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [milestonePda] = findMilestonePDA(eventPda, milestoneIndex);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        organizer: program.provider.publicKey,
        event: eventPda,
        escrow: escrowPda,
        milestone: milestonePda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        const organizerTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          escrowTokenAccount,
          organizerTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .releaseMilestone(milestoneIndex)
        .accounts(accounts)
        .rpc();

      success('Milestone released successfully!');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to release milestone');
      throw err;
    }
  };

  const getMilestone = async (eventPda: PublicKey, milestoneIndex: number) => {
    try {
      const program = getProgramWithSigner();
      const [milestonePda] = findMilestonePDA(eventPda, milestoneIndex);
      return await program.account.milestone.fetch(milestonePda);
    } catch {
      return null;
    }
  };

  const getAllMilestones = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const milestones = await program.account.milestone.all([
        {
          memcmp: {
            offset: 8,
            bytes: eventPda.toBase58()
          }
        }
      ]);
      return milestones.sort((a, b) => a.account.index - b.account.index);
    } catch (err) {
      console.error('Error fetching milestones:', err);
      return [];
    }
  };

  return {
    addMilestone,
    releaseMilestone,
    getMilestone,
    getAllMilestones
  };
};
