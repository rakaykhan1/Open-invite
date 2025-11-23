import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useApp } from '../context/AppContext';

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="flex flex-col items-center justify-center w-full h-full relative">
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -top-3 w-12 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />
      )}
      <Icon
        size={24}
        className={clsx(
          "transition-colors duration-300",
          isActive ? "text-primary" : "text-slate-400"
        )}
      />
      <span className={clsx("text-[10px] mt-1 font-medium", isActive ? "text-primary" : "text-slate-500")}>
        {label}
      </span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const { currentUser, loading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [currentUser, loading, navigate, location]);

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  if (location.pathname === '/auth') return children;

  return (
    <div className="min-h-screen bg-dark text-light flex justify-center overflow-hidden">
      <div className="w-full max-w-md h-screen flex flex-col relative bg-dark shadow-2xl overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-dark/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50">
          <NavItem to="/" icon={Home} label="Feed" />
          <NavItem to="/calendar" icon={Calendar} label="Calendar" />
          <NavItem to="/create" icon={PlusSquare} label="Plan" />
          <NavItem to="/friends" icon={User} label="Friends" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </nav>
      </div>
    </div>
  );
};

export default Layout;
