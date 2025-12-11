import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project } from '../types';
import { fetchProjects } from '../services/firebase';
import { ProjectCard } from '../components/UI/Card';
import { ProjectCardSkeleton } from '../components/UI/Skeletons';
import { ArrowLeft } from 'lucide-react';

const CategoryProjects: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjects();
        // Filter by the category from URL
        const filtered = data.filter(p => p.category === decodedCategory);
        setProjects(filtered);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [decodedCategory]);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/applications" className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Applications
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-10">
           <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {decodedCategory} Projects
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Browse all projects in the {decodedCategory} category.
              </p>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#0F0F0F] rounded-3xl border border-slate-200 dark:border-white/5 border-dashed">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
                 <p className="text-slate-500 dark:text-slate-400">
                   There are no projects in this category yet. Be the first to add one!
                 </p>
                 <Link to="/add-project" className="inline-block mt-6">
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-colors">
                       Submit Project
                    </button>
                 </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProjects;