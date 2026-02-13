'use client';
import { useState } from 'react';
import { useMilestone } from '@/hooks/useMilestone';
import { PublicKey } from '@solana/web3.js';
import { TokenType, parseTokenAmount } from '@/utils/tokens';

interface AddMilestoneFormProps {
  eventPda: PublicKey;
  acceptedTokens: TokenType[];
  onSuccess?: () => void;
}

export const AddMilestoneForm = ({ eventPda, acceptedTokens, onSuccess }: AddMilestoneFormProps) => {
  const { addMilestone } = useMilestone();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    dueDate: '',
    tokenType: acceptedTokens[0] || TokenType.SOL
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const milestoneIndex = Date.now();
      const parsedAmount = parseTokenAmount(formData.amount, formData.tokenType);
      const dueDateTimestamp = new Date(formData.dueDate).getTime() / 1000;
      
      await addMilestone(
        eventPda,
        milestoneIndex,
        formData.description,
        parsedAmount,
        dueDateTimestamp,
        formData.tokenType
      );
      
      setFormData({
        description: '',
        amount: '',
        dueDate: '',
        tokenType: acceptedTokens[0] || TokenType.SOL
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to add milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Add Milestone</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="e.g., Venue booking completed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
            <select
              value={formData.tokenType}
              onChange={(e) => setFormData({ ...formData, tokenType: e.target.value as TokenType })}
              className="w-32 p-3 border border-gray-300 rounded-md"
            >
              {acceptedTokens.map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Milestone'}
        </button>
      </form>
    </div>
  );
};
