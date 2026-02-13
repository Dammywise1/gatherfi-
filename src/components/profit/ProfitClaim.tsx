'use client';
import { useState, useEffect } from 'react';
import { useProfit } from '@/hooks/useProfit';
import { useContribution } from '@/hooks/useContribution';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmount, TokenType } from '@/utils/tokens';
import { Cell, Pie, PieChart, Tooltip, Legend } from 'recharts';

interface ProfitClaimProps {
  eventPda: PublicKey;
  event: any;
  isOrganizer: boolean;
}

export const ProfitClaim = ({ eventPda, event, isOrganizer }: ProfitClaimProps) => {
  const { getProfitDistribution, claimProfit, claimOrganizerProfit } = useProfit();
  const { getContributor } = useContribution();
  const { publicKey } = useWallet();
  const [profit, setProfit] = useState<any>(null);
  const [contributor, setContributor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [backerProfitAmount, setBackerProfitAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const profitData = await getProfitDistribution(eventPda);
      setProfit(profitData);
      
      if (publicKey && !isOrganizer) {
        const contributorData = await getContributor(eventPda, publicKey);
        setContributor(contributorData);
        
        if (profitData && contributorData && event.amountRaised > 0) {
          const share = (contributorData.amount / event.amountRaised) * profitData.backersShare;
          setBackerProfitAmount(share);
        }
      }
    };
    fetchData();
  }, [eventPda, publicKey, isOrganizer]);

  const handleClaimBackerProfit = async () => {
    if (!contributor) return;
    setLoading(true);
    try {
      await claimProfit(eventPda, contributor.publicKey, contributor.account.tokenType);
    } catch (error) {
      console.error('Failed to claim profit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrganizerProfit = async () => {
    setLoading(true);
    try {
      await claimOrganizerProfit(eventPda);
    } catch (error) {
      console.error('Failed to claim organizer profit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profit) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No profit distribution found</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Backers', value: profit.backersShare, color: '#3B82F6' },
    { name: 'Organizer', value: profit.organizerShare, color: '#10B981' },
    { name: 'Platform', value: profit.platformShare, color: '#8B5CF6' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Profit Distribution</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          <PieChart width={200} height={200}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {formatTokenAmount(profit.totalRevenue, TokenType.SOL)} SOL
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatTokenAmount(profit.expenses, TokenType.SOL)} SOL
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatTokenAmount(profit.netProfit, TokenType.SOL)} SOL
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        {isOrganizer ? (
          <div>
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Your Share (35%)</p>
              <p className="text-2xl font-bold text-green-600">
                {formatTokenAmount(profit.organizerShare, TokenType.SOL)} SOL
              </p>
            </div>
            <button
              onClick={handleClaimOrganizerProfit}
              disabled={loading || profit.distributed}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : profit.distributed ? 'Already Claimed' : 'Claim Organizer Profit'}
            </button>
          </div>
        ) : (
          contributor && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Your Profit Share</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTokenAmount(backerProfitAmount, contributor.account.tokenType)} {contributor.account.tokenType}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Claimed: {formatTokenAmount(contributor.account.profitsClaimed, contributor.account.tokenType)}
                </p>
              </div>
              <button
                onClick={handleClaimBackerProfit}
                disabled={loading || backerProfitAmount <= contributor.account.profitsClaimed}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Claim Your Profit'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
