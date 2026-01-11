import React, { useEffect, useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { fetchProjects } from '../services/firebase';
import { ProjectCard } from '../components/UI/Card';
import { ProjectCardSkeleton } from '../components/UI/Skeletons';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategorySection: React.FC<{ category: string; projects: Project[] }> = ({ category, projects }) => {
  return (
    <div className="border-b border-slate-200 dark:border-white/5 pb-10 last:border-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{category}</h2>
        
        <Link 
            to={`/category/${encodeURIComponent(category)}`}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm hover:text-primary-500 dark:hover:text-primary-300 transition-colors group"
        >
            View All
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

const Applications: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter projects based on search only (if search is active)
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  });

  // Get 5 most recent projects sorted by creation date
  const recentProjects = [...projects].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  // If search is active, show all results in a grid
  // If not, show category sections
  const isSearching = searchQuery.length > 0;

  // Process categories: Filter empty ones and sort by project count descending
  const sortedCategories = Object.values(ProjectCategory)
    .map(category => ({
      category,
      projects: projects.filter(p => p.category === category)
    }))
    .filter(item => item.projects.length > 0)
    .sort((a, b) => b.projects.length - a.projects.length);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-10">

          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Explore Applications
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Discover innovative student projects across the tech spectrum.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all shadow-lg dark:shadow-none"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="space-y-12">
             {[1, 2].map((i) => (
                 <div key={i} className="space-y-6">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5].map((j) => (
                            <ProjectCardSkeleton key={j} />
                        ))}
                    </div>
                 </div>
             ))}
          </div>
        ) : (
          <>
            {isSearching ? (
              // Search Results View
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Search Results</h2>
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      We couldn't find any projects matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Category View
              <div className="space-y-12">
                
                {/* Recently Added Section */}
                {recentProjects.length > 0 && (
                  <div className="border-b border-slate-200 dark:border-white/5 pb-10">
                    <div className="flex items-center gap-3 mb-6">
                       <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Recently Added</h2>
                       <span className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider border border-primary-200 dark:border-primary-500/20">
                          <Sparkles size={12} className="text-primary-600 dark:text-primary-400" />
                          New
                       </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {recentProjects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                )}

                {sortedCategories.map(({ category, projects: categoryProjects }) => {
                  // Limit to 5 items for the grid preview (fills one row on XL screens)
                  const displayProjects = categoryProjects.slice(0, 5);

                  return (
                    <CategorySection key={category} category={category} projects={displayProjects} />
                  );
                })}

                {sortedCategories.length === 0 && recentProjects.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects available</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                        Be the first to submit a project!
                        </p>
                    </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Applications;