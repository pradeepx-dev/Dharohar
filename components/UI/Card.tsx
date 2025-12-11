import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toggleProjectLike } from '../../services/firebase';
import { useToast } from '../../context/ToastContext';

interface ProjectCardProps {
  project: Project;
  onToggleLike?: (id: string, newIsLiked: boolean) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onToggleLike }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  // Ensure techStack is an array and take first 3 items
  const tags = Array.isArray(project.techStack) ? project.techStack.slice(0, 3) : [];
  
  const [isLiked, setIsLiked] = useState(currentUser ? project.likedBy.includes(currentUser.uid) : false);
  const [likeCount, setLikeCount] = useState(project.likes);

  const handleLike = async (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation if clicked on star
      e.stopPropagation();
      
      if (!currentUser) {
          showToast("Please login to like projects!", "info");
          return;
      }

      // Optimistic update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      
      if (onToggleLike) {
        onToggleLike(project.id, newLikedState);
      }

      try {
          await toggleProjectLike(project.id, currentUser.uid);
      } catch (error) {
          // Revert on error
          console.error("Failed to toggle like", error);
          setIsLiked(!newLikedState);
          setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
          showToast("Failed to update like", "error");
      }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F0F0F] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg dark:shadow-none group">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Category Overlay */}
        <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                {project.category}
            </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1" title={project.title}>
              {project.title}
            </h3>
            <button 
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0 transition-colors ${isLiked ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 hover:text-primary-500'}`}
            >
               <Star size={12} fill={isLiked ? "currentColor" : "none"} />
               <span>{likeCount}</span>
            </button>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed line-clamp-2 mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-white/5">
                    {tag}
                </span>
            ))}
        </div>

        <Link to={`/project/${project.id}`} className="mt-auto">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#252525] text-slate-700 dark:text-primary-400 hover:text-slate-900 dark:hover:text-primary-300 text-xs font-bold py-3 rounded-lg border border-slate-200 dark:border-white/5 transition-colors">
            View Details
            <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    </div>
  );
};