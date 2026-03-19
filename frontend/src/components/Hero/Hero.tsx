import React from 'react';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  return (
    <div className={`relative overflow-hidden group py-16 px-6 sm:px-12 lg:px-20 bg-slate-900 border-b border-slate-800 ${styles.heroContainer}`}>
      <div className={`absolute inset-0 bg-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${styles.noiseOverlay}`}></div>
      
      {/* Decorative blurred blobs */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Discover <span className="text-blue-500">Unique</span> Items
        </h2>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Bid on exclusive listings and win amazing deals. Fast, secure, and straightforward auctioning experience.
        </p>
        <div className="pt-4">
          <button className={`bg-blue-600 text-white hover:bg-blue-500 px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.65)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all transform hover:-translate-y-1 ${styles.actionBtn}`}>
            Explore Auctions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
