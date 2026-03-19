import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

interface BiddingSectionProps {
  auctionId: number;
  currentHighestBid: string;
  isExpired: boolean;
  onBidSuccess: (newAmount: string) => void;
}

const BiddingSection: React.FC<BiddingSectionProps> = ({
  auctionId,
  currentHighestBid,
  isExpired,
  onBidSuccess,
}) => {
  // Add 1 to the current bid to suggest the next minimum bid
  const suggestedBid = (parseFloat(currentHighestBid || '0') + 1.0).toFixed(2);
  const [bidAmount, setBidAmount] = useState<string>(suggestedBid);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (isExpired) {
      setErrorMsg('This auction has already closed.');
      return;
    }

    if (parseFloat(bidAmount) <= parseFloat(currentHighestBid)) {
      setErrorMsg(`Bid must be higher than $${currentHighestBid}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, 'bidder' would be determined by the authenticated user's token.
      // For this DRF setup, we are either passing bidder explicitly or the backend infers it.
      // Assuming DRF view infers request.user from token/session. If it requires bidder ID explicitly and we don't have auth,
      // it might fail with 400. We will handle generic 400 errors.
      const response = await api.post('/bids/', {
        item: auctionId,
        amount: parseFloat(bidAmount).toFixed(2),
        // bidder: 1, // Uncomment if hardcoding a user ID is needed for testing without full auth
      });
      
      if (response.status === 201) {
        onBidSuccess(response.data.amount);
        setBidAmount((parseFloat(response.data.amount) + 1.0).toFixed(2));
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        // Handle DRF validation errors
        // DRF usually returns an object like { amount: ["Bid must be higher..."], item: ["You cannot bid on your own auction."] }
        const data = error.response.data;
        const messages = Object.values(data).flat().join(' ');
        setErrorMsg(messages || 'Bad Request: Please check your bid.');
      } else {
        setErrorMsg('An unexpected error occurred while placing your bid.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">Current Highest Bid:</span>
        <span className="text-xl font-bold text-gray-900">${currentHighestBid}</span>
      </div>
      
        {user ? (
          <form onSubmit={handleBidSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  disabled={isExpired || isSubmitting}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                  placeholder="Enter bid amount"
                />
              </div>
              <button
                type="submit"
                disabled={isExpired || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
            
            {errorMsg && (
              <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">
                {errorMsg}
              </p>
            )}
          </form>
        ) : (
          <button
            onClick={() => navigate('/login')}
            disabled={isExpired}
            className="w-full py-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isExpired ? 'Auction Closed' : 'Log in to Place Bid'}
          </button>
        )}
      </div>
    );
  };
  
  export default BiddingSection;
