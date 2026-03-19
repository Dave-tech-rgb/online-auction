import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-xl shadow-inner group-hover:bg-blue-500 transition-colors">
            <span className="text-white font-extrabold text-xl tracking-tighter">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
            BidMaster Pro
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8 text-sm font-semibold text-slate-300">
            <li>
              <Link to="/" className={`cursor-pointer transition-all duration-200 py-5 border-b-2 border-transparent hover:border-slate-500 hover:text-white ${styles.navItem}`}>
                Home
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/create-auction" className={`cursor-pointer transition-all duration-200 py-5 border-b-2 border-transparent hover:border-slate-500 hover:text-white ${styles.navItem}`}>
                  Create Auction
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-300 text-sm font-medium">Hello, {user.username }</span>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
