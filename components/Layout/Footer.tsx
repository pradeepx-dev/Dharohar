import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#020202] py-8 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
         <div className="flex flex-col md:flex-row items-center gap-1 mb-4 md:mb-0 text-center md:text-left">
           <span>&copy; {new Date().getFullYear()} Dharohar.</span>
           <span className="hidden md:inline">•</span>
           <span>Built & Managed by RJIT Incubation Center.</span>
         </div>
         <div className="flex items-center gap-8">
           <Link to="/applications" className="hover:text-slate-900 dark:hover:text-white transition-colors">Discover</Link>
           <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
           <div className="flex items-center gap-4">
               <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Twitter size={18} /></a>
           </div>
         </div>
      </div>
    </footer>
  );
};