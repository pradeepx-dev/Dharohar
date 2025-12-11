import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Moon, Sun, LogIn, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Theme Toggle Logic
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      <nav className={`w-full transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-1' : 'bg-transparent border-b border-transparent dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-sm py-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-12">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
               <span className="font-extrabold text-2xl text-slate-900 dark:text-primary-400 tracking-tight">
                  Dharohar
               </span>
            </Link>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-8 text-base font-medium">
              <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">About</Link>
              <Link to="/add-project" className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">Add Your Project</Link>
              
              <button 
                onClick={toggleTheme}
                className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
              >
                 {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-white/10">
                  <Link 
                    to="/profile" 
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:ring-2 hover:ring-primary-500 transition-all overflow-hidden"
                    title="My Profile"
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-slate-600 dark:text-slate-400" />
                    )}
                  </Link>
                </div>
              ) : (
                <Link to="/login">
                   <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md">
                      <LogIn size={16} />
                      Sign In
                   </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden gap-4">
              <button 
                  onClick={toggleTheme}
                  className="text-slate-600 dark:text-slate-300 mr-2"
                >
                   {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-white/10">
            <div className="px-4 py-6 space-y-4 text-base">
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-slate-600 dark:text-slate-300 font-medium">About</Link>
              <Link to="/add-project" onClick={() => setIsOpen(false)} className="block text-slate-600 dark:text-slate-300 font-medium">Add Your Project</Link>
              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                {currentUser ? (
                    <div className="flex flex-col gap-3">
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                            <User size={18} />
                            My Profile
                        </Link>
                    </div>
                ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-primary-600 text-white py-3 rounded-xl font-bold">
                        Sign In
                    </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};