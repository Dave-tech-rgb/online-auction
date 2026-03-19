import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { AuctionItem } from '../../types/auction';
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import Hero from '../../components/Hero/Hero';
import { Loader2 } from 'lucide-react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auctions/');
      setAuctions(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch auctions:', err);
      setError('Could not load auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSuccess = (auctionId: number, newAmount: string) => {
    setAuctions(prevAuctions => 
      prevAuctions.map(auction => 
        auction.id === auctionId 
          ? { ...auction, current_highest_bid: newAmount } 
          : auction
      )
    );
  };

  return (
    <div className={`w-full ${styles.homeWrapper}`}>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Live Auctions
              <span className="relative flex h-3 w-3 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Don't miss out on these exclusive deals.</p>
          </div>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 py-1.5 px-4 rounded-full text-sm font-bold shadow-sm inline-flex items-center gap-2">
            <span className="text-blue-600">{auctions.length}</span> Active Items
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
               <p className="text-slate-500 font-medium animate-pulse">Loading auctions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10 shadow-sm">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h3 className="text-red-800 text-xl font-bold mb-2">Error Loading Auctions</h3>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button 
              onClick={fetchAuctions}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-md"
            >
              Try Again
            </button>
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <span className="text-3xl">🏜️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Active Auctions</h3>
            <p className="text-slate-500 font-medium">Check back later for new exclusive items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map(item => (
              <AuctionCard 
                key={item.id} 
                item={item} 
                onBidSuccess={handleBidSuccess} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
