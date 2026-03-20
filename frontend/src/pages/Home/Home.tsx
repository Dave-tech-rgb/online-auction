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
  const [search, setSearch] = useState('');  // ← NEW

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
      setError('Could not load auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSuccess = (auctionId: number, newAmount: string) => {
    setAuctions(prev =>
      prev.map(a => a.id === auctionId ? { ...a, current_highest_bid: newAmount } : a)
    );
  };

  const handleDeleteSuccess = (auctionId: number) => {
    setAuctions(prev => prev.filter(a => a.id !== auctionId));
  };

  // Filter auctions by search
  const filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="text-blue-600">{filtered.length}</span> Active Items
          </span>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search auctions..."
            className="w-full max-w-md border border-slate-300 rounded-lg py-2 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
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
            <h3 className="text-red-800 text-xl font-bold mb-2">Error Loading Auctions</h3>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button
              onClick={fetchAuctions}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              {search ? `No results for "${search}"` : 'No Active Auctions'}
            </h3>
            <p className="text-slate-500 font-medium">
              {search ? 'Try a different search term.' : 'Check back later for new exclusive items.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(item => (
              <AuctionCard
                key={item.id}
                item={item}
                onBidSuccess={handleBidSuccess}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;