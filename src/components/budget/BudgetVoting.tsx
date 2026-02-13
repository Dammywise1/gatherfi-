'use client';
import { useState, useEffect } from 'react';
import { useBudget } from '@/hooks/useBudget';
import { useContribution } from '@/hooks/useContribution';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmount } from '@/utils/tokens';

interface BudgetVotingProps {
  eventPda: PublicKey;
  event: any;
}

export const BudgetVoting = ({ eventPda, event }: BudgetVotingProps) => {
  const { voteOnBudget, getVote, getBudget } = useBudget();
  const { getContributor } = useContribution();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteDirection, setVoteDirection] = useState<boolean | null>(null);
  const [votingPower, setVotingPower] = useState(0);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicKey) return;
      
      const contributor = await getContributor(eventPda, publicKey);
      if (contributor) {
        setVotingPower(contributor.votingPower);
      }

      const vote = await getVote(eventPda, publicKey);
      if (vote) {
        setHasVoted(true);
        setVoteDirection(vote.approve);
      }

      const budgetData = await getBudget(eventPda);
      setBudget(budgetData);
    };
    fetchData();
  }, [eventPda, publicKey]);

  const handleVote = async (approve: boolean) => {
    if (!publicKey) return;
    setLoading(true);
    try {
      await voteOnBudget(eventPda, approve);
      setHasVoted(true);
      setVoteDirection(approve);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const yesPercentage = event.totalVotes > 0 
    ? (event.yesVotes / event.totalVotes) * 100 
    : 0;

  const formattedVotingPower = formatTokenAmount(votingPower, event.acceptedTokens[0]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Budget Voting</h3>
      
      {budget && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Proposed Budget</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatTokenAmount(budget.totalAmount, event.acceptedTokens[0])} {event.acceptedTokens[0]}
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Current Votes</span>
          <span className="text-sm font-medium text-gray-700">
            {yesPercentage.toFixed(1)}% Yes
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>✅ Yes: {formatTokenAmount(event.yesVotes, event.acceptedTokens[0])}</span>
          <span>❌ No: {formatTokenAmount(event.noVotes, event.acceptedTokens[0])}</span>
        </div>
      </div>

      {publicKey && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Your Voting Power</p>
          <p className="text-xl font-semibold text-blue-600">{formattedVotingPower} {event.acceptedTokens[0]}</p>
        </div>
      )}

      {!hasVoted ? (
        <div className="space-y-3">
          <button
            onClick={() => handleVote(true)}
            disabled={loading || !publicKey || votingPower === 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Voting...' : 'Vote YES'}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={loading || !publicKey || votingPower === 0}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? 'Voting...' : 'Vote NO'}
          </button>
          {votingPower === 0 && publicKey && (
            <p className="text-sm text-gray-500 text-center">
              You need to contribute to vote
            </p>
          )}
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            You voted <span className="font-semibold">{voteDirection ? 'YES' : 'NO'}</span>
          </p>
        </div>
      )}
    </div>
  );
};
