import React from 'react';
import type { AuctionItem } from '../../types/auction';
import CountdownTimer from '../CountdownTimer';
import BiddingSection from '../BiddingSection';
import BidHistory from '../BidHistory/BidHistory';
import styles from './AuctionCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

interface AuctionCardProps {
  item: AuctionItem;
  onBidSuccess: (auctionId: number, newAmount: string) => void;
  onDeleteSuccess: (auctionId: number) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ item, onBidSuccess, onDeleteSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = Number(user?.user_id) === item.seller;

  const handleExpire = () => {};

  const handleSuccessfulBid = (newAmount: string) => {
    onBidSuccess(item.id, newAmount);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this auction?')) return;
    try {
      await api.delete(`/auctions/${item.id}/`);
      onDeleteSuccess(item.id);
    } catch (err) {
      alert('Failed to delete auction.');
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${styles.cardWrapper}`}>

      <div className="w-full h-48 bg-slate-100 border-b border-slate-200 flex items-center justify-center relative overflow-hidden group">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-slate-400 font-medium">No Image</span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">

        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <h3
              onClick={() => navigate(`/auction/${item.id}`)}
              className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
              title={item.title}
            >
              {item.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click title to view details</p>
          </div>
          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
            Lot #{item.id}
          </span>
        </div>

    
        <p className="text-slate-600 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">
          {item.description}
        </p>

      
        {item.is_expired && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-yellow-800 font-bold text-sm">
              Winner: {item.winner ?? 'No bids placed'}
            </p>
          </div>
        )}

       
        <div className="space-y-3 text-sm mt-auto border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-medium">Starting Price</span>
            <span className="font-bold text-slate-700">${item.starting_price}</span>
          </div>
          <div className={`flex justify-between items-center p-3 rounded-lg border transition-colors duration-300 ${item.is_expired ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/50 border-blue-100'}`}>
            <span className="font-semibold text-slate-600">Time Left</span>
            <CountdownTimer endTime={item.end_time} onExpire={handleExpire} />
          </div>
        </div>

        
        <div className="mt-5">
          <BiddingSection
            auctionId={item.id}
            currentHighestBid={item.current_highest_bid}
            isExpired={item.is_expired}
            onBidSuccess={handleSuccessfulBid}
          />
          <BidHistory
            auctionId={item.id}
            currentHighestBid={item.current_highest_bid}
          />
        </div>

       
        {isOwner && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate(`/edit-auction/${item.id}`)}
              className="flex-1 py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-sm font-semibold transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 px-4 border border-red-200 hover:bg-red-50 text-red-500 rounded-md text-sm font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuctionCard;