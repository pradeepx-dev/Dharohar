import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProjects, deleteProject, fetchLikedProjects } from '../services/firebase';
import { Project } from '../types';
import { ProjectCard } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, Mail, LogOut, Trash2, Edit2, Facebook, Heart, Grid, AlertCircle } from 'lucide-react';
import { ProjectCardSkeleton, ProfileHeaderSkeleton } from '../components/UI/Skeletons';
import { useToast } from '../context/ToastContext';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my_projects' | 'favorites'>('my_projects');

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          const [userProj, likedProj] = await Promise.all([
             fetchUserProjects(currentUser.uid),
             fetchLikedProjects(currentUser.uid)
          ]);
          setMyProjects(userProj);
          setLikedProjects(likedProj);
        } catch (error) {
          console.error("Failed to load user data", error);
          showToast("Failed to load user data", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [currentUser, showToast]);

  const handleLogout = async () => {
      await logout();
      navigate('/');
  };

  const confirmDelete = (projectId: string) => {
      setProjectToDelete(projectId);
      setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (projectToDelete) {
        try {
            await deleteProject(projectToDelete);
            setMyProjects(myProjects.filter(p => p.id !== projectToDelete));
            setLikedProjects(likedProjects.filter(p => p.id !== projectToDelete));
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
            showToast("Project deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete project", error);
            showToast("Failed to delete project", "error");
        }
    }
  };

  const getProviderBadge = () => {
    const providerId = currentUser?.providerData?.[0]?.providerId;
    
    if (providerId === 'google.com') {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm whitespace-nowrap">
                <svg className="w-3.5 h-3.5" viewBox="0 0 488 512" aria-hidden="true">
                   <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                <span>Google</span>
            </div>
        );
    }
    if (providerId === 'facebook.com') {
        return (
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1877F2]/10 dark:bg-[#1877F2]/20 rounded-full border border-[#1877F2]/20 text-xs font-bold text-[#1877F2] dark:text-[#418df5] shadow-sm whitespace-nowrap">
                <Facebook size={14} fill="currentColor" />
                <span>Facebook</span>
            </div>
        );
    }
    if (providerId === 'twitter.com') {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm whitespace-nowrap">
                <svg className="w-3 h-3" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
               </svg>
                <span>X (Twitter)</span>
            </div>
        );
    }
    return null;
  };

  const handleProjectLike = (projectId: string, isLiked: boolean) => {
    if (!currentUser) return;

    if (isLiked) {
        // Add to liked projects
        // We find the project details from myProjects if possible, or we might need to fetch it (UI limitation here, usually we have the project data)
        // For optimisitic update, we can try to find it in myProjects or just trust the backend refetch eventually.
        // But for "instant" UI, we need the object.
        
        const project = myProjects.find(p => p.id === projectId);
        if (project) {
            // Check if already in liked (dedupe)
            if (!likedProjects.some(p => p.id === projectId)) {
                 setLikedProjects(prev => [...prev, { ...project, likes: project.likes + 1, likedBy: [...project.likedBy, currentUser.uid] }]);
            }
        }
    } else {
        // Remove from liked projects
        setLikedProjects(prev => prev.filter(p => p.id !== projectId));
    }

    // Also update the "My Projects" list to reflect the new like count/status if it's there
    setMyProjects(prev => prev.map(p => {
        if (p.id === projectId) {
            const newLikedBy = isLiked 
                ? [...p.likedBy, currentUser.uid]
                : p.likedBy.filter(uid => uid !== currentUser.uid);
            
            return {
                ...p,
                likes: isLiked ? p.likes + 1 : p.likes - 1,
                likedBy: newLikedBy
            };
        }
        return p;
    }));
  };

  const projectsToShow = activeTab === 'my_projects' ? myProjects : likedProjects;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-[#0F0F0F] rounded-3xl p-8 mb-10 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-xl">
                    {currentUser?.photoURL ? (
                       <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <User size={40} />
                       </div>
                    )}
                 </div>
              </div>

              <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {currentUser?.displayName || 'Anonymous User'}
                    </h1>
                    {getProviderBadge()}
                 </div>
                 
                 <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium mb-6">
                    <Mail size={16} />
                    {currentUser?.email}
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <Link to="/add-project">
                        <Button variant="primary" className="h-10 text-sm px-6">
                           <Plus size={18} className="mr-2" />
                           Add New Project
                        </Button>
                    </Link>
                    <Button variant="outline" className="h-10 text-sm px-6" onClick={handleLogout}>
                       <LogOut size={18} className="mr-2" />
                       Sign Out
                    </Button>
                 </div>
              </div>
              
              {/* Stats */}
              <div className="flex gap-6 md:gap-10 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-6 md:pt-0 pl-0 md:pl-10">
                  <div className="text-center">
                     <div className="text-2xl font-bold text-slate-900 dark:text-white">{myProjects.length}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</div>
                  </div>
                  <div className="text-center">
                     <div className="text-2xl font-bold text-slate-900 dark:text-white">{likedProjects.length}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Favorites</div>
                  </div>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 dark:border-white/5 mb-8">
            <button 
                onClick={() => setActiveTab('my_projects')}
                className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'my_projects' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
               <Grid size={18} />
               My Projects
            </button>
            <button 
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'favorites' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
               <Heart size={18} />
               Favorites
            </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3].map(i => <ProjectCardSkeleton key={i} />)}
             </div>
        ) : (
            <>
                {projectsToShow.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsToShow.map(project => (
                            <div key={project.id} className="group relative">
                                <ProjectCard project={project} onToggleLike={handleProjectLike} />
                                
                                {activeTab === 'my_projects' && (
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/edit-project/${project.id}`}>
                                            <button className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-lg hover:text-primary-500 transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); confirmDelete(project.id); }}
                                            className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-lg hover:text-red-500 transition-colors" 
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#0F0F0F] rounded-3xl border border-slate-200 dark:border-white/5 border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
                             {activeTab === 'my_projects' ? <Grid size={32} /> : <Heart size={32} />}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {activeTab === 'my_projects' ? 'No projects yet' : 'No favorites yet'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            {activeTab === 'my_projects' 
                                ? "You haven't submitted any projects yet. Share your first innovation with the community!" 
                                : "You haven't liked any projects yet. Explore and find something inspiring!"}
                        </p>
                        {activeTab === 'my_projects' && (
                            <Link to="/add-project" className="inline-block mt-6">
                                <Button variant="primary">
                                    Submit Project
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 p-6 animate-in zoom-in-95 duration-200">
                 <div className="flex items-center gap-4 mb-4 text-red-500">
                     <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                         <AlertCircle size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Project?</h3>
                 </div>
                 <p className="text-slate-600 dark:text-slate-400 mb-8">
                     Are you sure you want to delete this project? This action cannot be undone.
                 </p>
                 <div className="flex justify-end gap-3">
                     <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                     <Button className="bg-red-600 hover:bg-red-700 text-white border-transparent" onClick={handleDelete}>
                         Delete Project
                     </Button>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default UserProfile;