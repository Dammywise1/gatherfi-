'use client';
import { useState, useEffect } from 'react';
import { useMilestone } from '@/hooks/useMilestone';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmount } from '@/utils/tokens';
import { formatDate, isDeadlinePassed } from '@/utils/date';

interface MilestoneListProps {
  eventPda: PublicKey;
  event: any;
  isOrganizer: boolean;
}

export const MilestoneList = ({ eventPda, event, isOrganizer }: MilestoneListProps) => {
  const { getAllMilestones, releaseMilestone } = useMilestone();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMilestones = async () => {
      const fetched = await getAllMilestones(eventPda);
      setMilestones(fetched);
    };
    fetchMilestones();
  }, [eventPda]);

  const handleRelease = async (milestoneIndex: number, tokenType: any) => {
    setLoading(true);
    try {
      await releaseMilestone(eventPda, milestoneIndex, tokenType);
      const updated = await getAllMilestones(eventPda);
      setMilestones(updated);
    } catch (error) {
      console.error('Failed to release milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  if (milestones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No milestones added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Milestones</h3>
      <div className="space-y-4">
        {milestones.map(({ account: milestone }) => (
          <div
            key={milestone.index}
            className={`border rounded-lg p-4 ${
              milestone.released ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">
                  Milestone {milestone.index + 1}: {milestone.description}
                </h4>
                <p className="text-sm text-gray-600">
                  Amount: {formatTokenAmount(milestone.amount, milestone.tokenType)} {milestone.tokenType}
                </p>
                <p className="text-sm text-gray-600">
                  Due: {formatDate(milestone.dueDate)}
                </p>
                {milestone.released && milestone.releaseDate && (
                  <p className="text-sm text-green-600">
                    Released: {formatDate(milestone.releaseDate)}
                  </p>
                )}
              </div>
              {isOrganizer && !milestone.released && (
                <button
                  onClick={() => handleRelease(milestone.index, milestone.tokenType)}
                  disabled={loading || !isDeadlinePassed(milestone.dueDate)}
                  className={`px-4 py-2 rounded-md text-white ${
                    isDeadlinePassed(milestone.dueDate)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Releasing...' : 'Release'}
                </button>
              )}
              {milestone.released && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Released
                </span>
              )}
            </div>
            {!isDeadlinePassed(milestone.dueDate) && !milestone.released && (
              <p className="text-sm text-yellow-600 mt-2">
                ⏳ Available to release on {formatDate(milestone.dueDate)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
