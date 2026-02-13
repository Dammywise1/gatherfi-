'use client';
import { useState } from 'react';
import { TokenType, parseTokenAmount, formatTokenAmount, getTokenTypeString } from '@/utils/tokens';
import { useContribution } from '@/hooks/useContribution';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface ContributionFormProps {
  eventPda: PublicKey;
  acceptedTokens: string[] | TokenType[];
  targetAmount: number;
  amountRaised: number;
}

export const ContributionForm = ({ 
  eventPda, 
  acceptedTokens, 
  targetAmount, 
  amountRaised 
}: ContributionFormProps) => {
  const { contribute } = useContribution();
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>(
    typeof acceptedTokens[0] === 'string' ? acceptedTokens[0] as string : 'SOL'
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    setLoading(true);
    try {
      const parsedAmount = parseTokenAmount(amount, selectedToken as TokenType);
      await contribute(eventPda, parsedAmount, selectedToken as TokenType);
      setAmount('');
    } catch (error) {
      console.error('Contribution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const remainingAmount = targetAmount - amountRaised;
  const remainingFormatted = formatTokenAmount(remainingAmount, selectedToken);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Contribute to this Event</h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Funding Goal Remaining</p>
        <p className="text-2xl font-bold text-blue-600">{remainingFormatted} {selectedToken}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Token
          </label>
          <div className="flex gap-2">
            {acceptedTokens.map((token) => {
              const tokenStr = typeof token === 'string' ? token : getTokenTypeString(token);
              return (
                <button
                  key={tokenStr}
                  type="button"
                  onClick={() => setSelectedToken(tokenStr)}
                  className={`flex-1 py-2 px-4 rounded-md border ${
                    selectedToken === tokenStr
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tokenStr}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={`0.00 ${selectedToken}`}
              required
            />
            <span className="absolute right-3 top-3 text-gray-500">
              {selectedToken}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : `Contribute ${selectedToken}`}
        </button>
      </form>
    </div>
  );
};
