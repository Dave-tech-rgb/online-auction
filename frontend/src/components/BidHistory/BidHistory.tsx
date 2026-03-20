import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import styles from './BidHistory.module.css';

interface BidEntry {
  id: number;
  item: number;
  bidder: number;
  bidder_username: string;
  amount: string;
  timestamp: string;
}

interface BidHistoryProps {
  auctionId: number;
  currentHighestBid: string;
}

const BidHistory: React.FC<BidHistoryProps> = ({ auctionId, currentHighestBid }) => {
  const [bids, setBids] = useState<BidEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/auctions/${auctionId}/bids/`);
      setBids(response.data);
    } catch (err) {
      setError('Failed to load bid history.');
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  useEffect(() => {
    if (isOpen) {
      fetchBids();
    }
  }, [isOpen, fetchBids, currentHighestBid]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className={`mt-3 border-t border-slate-100 pt-3 ${styles.wrapper}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 py-1 group"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Bid History
          {bids.length > 0 && isOpen && (
            <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">
              {bids.length}
            </span>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <div className={styles.panelInner}>
          {loading ? (
            <div className="flex items-center justify-center py-6 gap-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-slate-500 text-sm font-medium animate-pulse">Loading bids...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <p className="text-red-500 text-sm font-medium">{error}</p>
              <button
                onClick={fetchBids}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : bids.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2 text-center">
              <span className="text-2xl">🪙</span>
              <p className="text-slate-500 text-sm font-medium">No bids placed yet.</p>
              <p className="text-slate-400 text-xs">Be the first to bid!</p>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors duration-150 ${
                    index === 0
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                  } ${styles.bidRow}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Rank badge */}
                    <span
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {index === 0 ? '🏆' : index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${index === 0 ? 'text-blue-800' : 'text-slate-700'}`}>
                        {bid.bidder_username ?? `Bidder #${bid.bidder}`}
                        {index === 0 && (
                          <span className="ml-1.5 text-xs font-bold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">
                            Highest
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(bid.timestamp)}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-extrabold ${
                      index === 0 ? 'text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    {formatAmount(bid.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidHistory;