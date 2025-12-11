import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectById } from '../services/firebase';
import { Project } from '../types';
import { Github, ArrowLeft, Calendar, User, Layers, ExternalLink } from 'lucide-react';
import { ProjectDetailsSkeleton } from '../components/UI/Skeletons';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (id) {
        const data = await fetchProjectById(id);
        setProject(data);
      }
      setLoading(false);
    };
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505]">
         <div className="max-w-7xl mx-auto">
             <ProjectDetailsSkeleton />
         </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#050505]">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Project not found</h2>
        <Link to="/" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Image (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm relative aspect-[4/3]">
               {/* Fixed to 4:3 Aspect Ratio */}
               <img 
                 src={project.imageUrl} 
                 alt={project.title} 
                 className="w-full h-full object-cover" 
               />
            </div>
          </div>

          {/* Right Column - Details (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
             <div>
                <div className="flex items-center gap-3 mb-4">
                   <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 uppercase tracking-wide border border-primary-200 dark:border-primary-500/20">
                      {project.category}
                   </span>
                   <span className="text-slate-400 dark:text-slate-500 text-sm font-medium flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(project.createdAt).toLocaleDateString()}
                   </span>
                </div>
                
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                  {project.title}
                </h1>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#0F0F0F] border border-slate-200 dark:border-white/5 shadow-sm mb-8">
                   <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <User size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Created by</div>
                      <div className="text-slate-900 dark:text-white font-bold text-lg">{project.authorName}</div>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="w-full">
                      <button className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">
                         <Github size={20} />
                         View Source Code
                      </button>
                   </a>
                   
                   {project.liveDemoLink ? (
                      <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="w-full">
                        <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <ExternalLink size={20} />
                            Live Demo
                        </button>
                      </a>
                   ) : (
                      <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold py-4 rounded-xl border border-slate-200 dark:border-white/5 cursor-not-allowed">
                          <ExternalLink size={20} />
                          Live Demo Not Available
                      </button>
                   )}
                </div>
             </div>

             <div className="border-t border-slate-200 dark:border-white/10 pt-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-primary-600 dark:text-primary-400" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm border border-slate-200 dark:border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Full Width Description Section below */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About this Project</h3>
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
               <p className="whitespace-pre-wrap">{project.description}</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;