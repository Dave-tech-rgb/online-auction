import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-grow w-full flex flex-col relative z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
