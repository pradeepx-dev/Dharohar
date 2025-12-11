import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { fetchProjects } from '../services/firebase';
import { ProjectCard } from '../components/UI/Card';
import { Loader2, Zap, Users, Rocket, Youtube, Play, ArrowRight, Github } from 'lucide-react';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-30"></div>
      </div>

      {/* Massive Hero Section - Full Height - Reduced Font Size */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 text-center border-b border-slate-200 dark:border-white/5 pt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.0] text-slate-900 dark:text-white">
            Welcome to <span className="text-primary-600 dark:text-primary-400">Dharohar</span>
          </h1>
          
          <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-14 font-medium font-sans leading-relaxed">
            World's largest Student Developer community.<br className="hidden lg:block"/> Showcase your
            web applications and discover innovative projects.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/applications" className="w-full sm:w-auto">
              <button 
                className="w-full px-8 py-4 rounded-xl bg-primary-600 dark:bg-primary-500 hover:bg-primary-500 dark:hover:bg-primary-400 text-white dark:text-black font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(74,222,128,0.3)]"
              >
                Explore Apps
              </button>
            </Link>
            <Link to="/add-project" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-xl border-2 border-primary-600 dark:border-primary-500 text-primary-700 dark:text-primary-400 hover:bg-primary-500/10 font-bold text-lg transition-all hover:scale-105">
                Submit Your App
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Applications Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-primary-400 mb-4 tracking-tight">Featured Applications</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Discover trending projects from our community</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-16 w-16 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            <div className="flex justify-center mt-16">
              <Link to="/applications">
                <button className="flex items-center gap-3 px-8 py-4 rounded-xl border border-slate-300 dark:border-white/20 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-bold text-base sm:text-lg text-slate-700 dark:text-white">
                  View All Applications
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Why Choose Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-primary-400 mb-4 tracking-tight">Why Choose Dharohar?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">The perfect platform for developers to showcase their work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-colors text-center group shadow-lg dark:shadow-none">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform bg-primary-100 dark:bg-primary-500/10 rounded-2xl">
              <Zap size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Centralized Hub</h3>
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed">
              Manage and showcase your web applications in one place. Keep your portfolio organized and accessible.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-colors text-center group shadow-lg dark:shadow-none">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform bg-primary-100 dark:bg-primary-500/10 rounded-2xl">
              <Users size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Developer Focused</h3>
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed">
              Built by developers, for developers. Share your work with a community that understands your code.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-colors text-center group shadow-lg dark:shadow-none">
            <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform bg-primary-100 dark:bg-primary-500/10 rounded-2xl">
              <Rocket size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Launch & Grow</h3>
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-relaxed">
              Get visibility, feedback, and grow your application with our community support and exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Follow Our Journey Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-slate-200 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-primary-400 mb-4 tracking-tight">Follow Our Journey</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Learn no-code and low-code development through our tutorials and byte-sized content</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Detailed Content */}
           <div>
              <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
                 <Youtube className="text-red-600 dark:text-primary-400" size={28} />
                 <span className="font-bold text-2xl text-slate-900 dark:text-white">Detailed Content</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group cursor-pointer aspect-video bg-slate-100 dark:bg-slate-900 shadow-xl">
                  {/* Placeholder for Video Thumbnail */}
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                     <Play className="text-slate-800 dark:text-white fill-current opacity-80 group-hover:scale-110 transition-transform" size={64} />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                     <h3 className="text-white font-bold text-2xl drop-shadow-md">How to Build a SaaS in 2024</h3>
                  </div>
              </div>
              <div className="mt-8 text-center">
                 <button className="px-8 py-3 rounded-full border border-primary-500/50 text-primary-600 dark:text-primary-400 text-sm font-bold hover:bg-primary-500/10 transition-colors uppercase tracking-wide">
                    Subscribe for More Detailed Content
                 </button>
              </div>
           </div>

           {/* Byte-sized Content */}
           <div>
              <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
                 <div className="w-7 h-7 rounded-lg border-2 border-primary-600 dark:border-primary-400"></div>
                 <span className="font-bold text-2xl text-slate-900 dark:text-white">Byte-sized Content</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-[9/16] bg-slate-100 dark:bg-slate-900 group cursor-pointer shadow-xl">
                      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Play className="text-slate-800 dark:text-white fill-current opacity-80 group-hover:scale-110 transition-transform" size={40} />
                      </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-[9/16] bg-slate-100 dark:bg-slate-900 group cursor-pointer shadow-xl">
                      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Play className="text-slate-800 dark:text-white fill-current opacity-80 group-hover:scale-110 transition-transform" size={40} />
                      </div>
                  </div>
              </div>
              <div className="mt-8 text-center">
                 <button className="px-8 py-3 rounded-full border border-primary-500/50 text-primary-600 dark:text-primary-400 text-sm font-bold hover:bg-primary-500/10 transition-colors uppercase tracking-wide">
                    Follow for More Byte-sized Content
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#020202] py-12 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
           <div className="flex items-center gap-1 mb-4 md:mb-0">
             <span>Built by</span>
             <a href="#" className="underline hover:text-slate-900 dark:hover:text-white transition-colors">builders</a>
           </div>
           <div className="flex items-center gap-8">
             <Link to="/applications" className="hover:text-slate-900 dark:hover:text-white transition-colors">Discover</Link>
             <Link to="/add-project" className="hover:text-slate-900 dark:hover:text-white transition-colors">Submit</Link>
             <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={18} /></a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;