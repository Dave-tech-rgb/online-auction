import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center text-slate-400 text-sm mb-4">
          <p className="font-medium">&copy; {new Date().getFullYear()} BidMaster Pro. All rights reserved.</p>
          <p className="mt-2 text-xs text-slate-500">Transforming the auction experience.</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
