
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LogOut, Sun, Moon, GraduationCap, Box } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDarkMode ? 'bg-black/50 border-b border-white/10' : 'bg-white/50 border-b border-orange-200'
    } backdrop-blur-md`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center orange-glow group-hover:scale-110 transition-transform">
             <Box className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Curious <span className="text-orange-500">Fox</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-orange-100'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                <span className="text-[10px] opacity-50 uppercase tracking-widest">{user.usn}</span>
              </div>
              <button 
                onClick={() => {
                  onLogout();
                  navigate('/auth');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
