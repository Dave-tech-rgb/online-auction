import React from 'react';
import type { AuctionItem } from '../../types/auction';
import CountdownTimer from '../CountdownTimer'; // keeping this where it is or move it? Let's leave it in components/ for now
import BiddingSection from '../BiddingSection'; // same
import styles from './AuctionCard.module.css';

interface AuctionCardProps {
  item: AuctionItem;
  onBidSuccess: (auctionId: number, newAmount: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ item, onBidSuccess }) => {
  const handleExpire = () => {
    // Optional handle item expiration globally
  };

  const handleSuccessfulBid = (newAmount: string) => {
    onBidSuccess(item.id, newAmount);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${styles.cardWrapper}`}>
      {/* Image Area */}
      <div className="w-full h-48 bg-slate-100 border-b border-slate-200 flex items-center justify-center relative overflow-hidden group">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="text-slate-400 font-medium">No Image</span>
        )}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight" title={item.title}>
            {item.title}
          </h3>
          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
            Lot #{item.id}
          </span>
        </div>
        
        <p className="text-slate-600 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">
          {item.description}
        </p>
        
        <div className="space-y-3 text-sm mt-auto border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-medium">Starting Price</span>
            <span className="font-bold text-slate-700">${item.starting_price}</span>
          </div>
          <div className={`flex justify-between items-center p-3 rounded-lg border transition-colors duration-300 ${item.is_expired ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/50 border-blue-100'}`}>
            <span className="font-semibold text-slate-600">Time Left</span>
            <CountdownTimer 
              endTime={item.end_time} 
              onExpire={handleExpire}
            />
          </div>
        </div>

        <div className="mt-5">
          <BiddingSection
            auctionId={item.id}
            currentHighestBid={item.current_highest_bid}
            isExpired={item.is_expired}
            onBidSuccess={handleSuccessfulBid}
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
