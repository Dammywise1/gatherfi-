'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGatherFiProgram } from '@/utils/anchor';
import { useEvent } from '@/hooks/useEvent';
import { formatTokenAmount } from '@/utils/tokens';
import Link from 'next/link';

export default function MyContributionsPage() {
  const { publicKey } = useWallet();
  const { getProgramWithSigner } = useGatherFiProgram();
  const { getEvent } = useEvent();
  
  const [contributions, setContributions] = useState<any[]>([]);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const program = getProgramWithSigner();
        const allContributions = await program.account.contributor.all([
          {
            memcmp: {
              offset: 8 + 32,
              bytes: publicKey.toBase58()
            }
          }
        ]);
        setContributions(allContributions);
        
        const eventMap: Record<string, any> = {};
        for (const contribution of allContributions) {
          if (!eventMap[contribution.account.event.toBase58()]) {
            const eventData = await getEvent(contribution.account.event);
            eventMap[contribution.account.event.toBase58()] = eventData;
          }
        }
        setEvents(eventMap);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view contributions</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading your contributions...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Contributions</h1>

      {contributions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You haven't made any contributions yet</p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Fund an Event →
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voting Power
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributions.map(({ pubkey, account }) => {
                const event = events[account.event.toBase58()];
                const isRefundable = event?.status === 'Failed' || event?.status === 'Cancelled';

                return (
                  <tr key={pubkey.toBase58()}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {event?.name || 'Unknown Event'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {account.event.toBase58().slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTokenAmount(account.amount, account.tokenType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.tokenType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTokenAmount(account.votingPower, account.tokenType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.refundClaimed 
                          ? 'bg-gray-100 text-gray-800'
                          : isRefundable 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {account.refundClaimed 
                          ? 'Refunded' 
                          : isRefundable 
                            ? 'Refund Available' 
                            : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/event/${account.event.toBase58()}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
