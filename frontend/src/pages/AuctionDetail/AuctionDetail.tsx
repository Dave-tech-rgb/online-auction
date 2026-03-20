import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import type { AuctionItem, Bid } from '../../types/auction';
import CountdownTimer from '../../components/CountdownTimer';

const AuctionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctionDetail();
    fetchBidHistory();
  }, [id]);

  const fetchAuctionDetail = async () => {
    try {
      const res = await api.get(`/auctions/${id}/`);
      setAuction(res.data);
    } catch (err) {
      setError('Failed to load auction details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBidHistory = async () => {
    try {
      const res = await api.get(`/auctions/${id}/bids/`);
      setBids(res.data);
    } catch (err) {
      console.error('Failed to load bid history.');
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <p className="text-slate-500 font-medium animate-pulse">Loading auction details...</p>
    </div>
  );

  if (error || !auction) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <p className="text-red-500 font-medium">{error ?? 'Auction not found.'}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

      
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1 transition-colors"
      >
        ← Back to Auctions
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center min-h-[300px]">
          {auction.image ? (
            <img src={auction.image} alt={auction.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 font-medium">No Image</span>
          )}
        </div>

        
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lot #{auction.id}</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{auction.title}</h1>
            <p className="text-slate-500 mt-2 leading-relaxed">{auction.description}</p>
          </div>

          
          {auction.is_expired ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <p className="text-yellow-700 text-xs font-bold uppercase tracking-widest mb-1">Auction Ended</p>
              <p className="text-yellow-900 font-extrabold text-lg">
                Winner: {auction.winner ?? 'No bids placed'}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">Time Remaining</p>
              <CountdownTimer endTime={auction.end_time} onExpire={fetchAuctionDetail} />
            </div>
          )}

          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium text-sm">Starting Price</span>
              <span className="text-slate-700 font-bold">${auction.starting_price}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
              <span className="text-slate-500 font-medium text-sm">Current Highest Bid</span>
              <span className="text-blue-600 font-extrabold text-lg">${auction.current_highest_bid}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="mt-12">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
          Bid History
          {bids.length > 0 && (
            <span className="ml-3 text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
              {bids.length} bids
            </span>
          )}
        </h2>

        {bids.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No bids placed yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold">#</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold">Bidder</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold">Amount</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => (
                  <tr
                    key={bid.id}
                    className={`border-b border-slate-100 transition-colors ${
                      index === 0 ? 'bg-yellow-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-4 text-slate-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {index === 0 && (
                        <span className="mr-2 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200">
                          Top
                        </span>
                      )}
                      {bid.bidder_username ?? `Bidder #${bid.bidder}`}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      ${parseFloat(bid.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(bid.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;