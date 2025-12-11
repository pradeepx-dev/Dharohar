import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProjectById, updateProject } from '../services/firebase';
import { uploadImage } from '../services/imgbb';
import { ProjectCategory } from '../types';
import { Button } from '../components/UI/Button';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveDemoLink: '',
    category: ProjectCategory.Web,
    techStack: '',
    imageUrl: '',
  });

  useEffect(() => {
      const loadProject = async () => {
          if (!id) return;
          try {
              const project = await fetchProjectById(id);
              if (project) {
                  // Check ownership
                  if (currentUser && project.userId !== currentUser.uid && !project.userId.startsWith('mock')) {
                      showToast("You do not have permission to edit this project.", "error");
                      navigate('/applications');
                      return;
                  }

                  setFormData({
                      title: project.title,
                      description: project.description,
                      githubLink: project.githubLink,
                      liveDemoLink: project.liveDemoLink || '',
                      category: project.category as ProjectCategory,
                      techStack: project.techStack.join(', '),
                      imageUrl: project.imageUrl
                  });
                  setPreviewUrl(project.imageUrl);
              }
          } catch (error) {
              console.error("Failed to load project", error);
              showToast("Failed to load project details", "error");
          } finally {
              setLoading(false);
          }
      };
      loadProject();
  }, [id, currentUser, navigate, showToast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation: Max 3MB
      if (file.size > 3 * 1024 * 1024) {
          showToast("File size exceeds 3MB. Please upload a smaller image.", "error");
          return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !currentUser) return;

    setSaving(true);

    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
          try {
            const timeoutPromise = new Promise<string>((_, reject) => {
              setTimeout(() => reject(new Error("Upload timed out")), 10000);
            });

            imageUrl = await Promise.race([uploadImage(imageFile), timeoutPromise]);
          } catch (uploadError: any) {
            console.error("Image upload issue:", uploadError);
            if (uploadError.message === "Upload timed out") {
                showToast("New image upload timed out (10s). Keeping existing image.", "error");
            } else {
                showToast("New image upload failed. Keeping existing image.", "error");
            }
             if (!imageUrl) {
                 imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop";
             }
          }
      } else if (!imageUrl && !previewUrl) {
           showToast("Please select an image for your project.", "error");
           setSaving(false);
           return;
      }

      const stackArray = formData.techStack.split(',').map(item => item.trim()).filter(i => i.length > 0);

      await updateProject(id, {
        title: formData.title,
        description: formData.description,
        githubLink: formData.githubLink,
        liveDemoLink: formData.liveDemoLink,
        category: formData.category,
        techStack: stackArray,
        imageUrl: imageUrl,
      });
      
      showToast("Project updated successfully", "success");
      navigate('/profile');
    } catch (error) {
      console.error("Error updating project", error);
      showToast("Failed to update project", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
      return <div className="min-h-screen pt-24 flex justify-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Project</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Update your project details.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Input Fields (Span 2) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Section 1: Basic Info */}
                <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Project Details
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Title</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                                    placeholder="e.g. AI Task Manager"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <div className="relative">
                                <textarea
                                    required
                                    rows={5}
                                    className="block w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors resize-none leading-relaxed"
                                    placeholder="Briefly describe what your project does..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="block w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value as ProjectCategory})}
                                    >
                                        {Object.values(ProjectCategory).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tech Stack</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        className="block w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="React, Firebase, Tailwind..."
                                        value={formData.techStack}
                                        onChange={e => setFormData({...formData, techStack: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Links */}
                <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">GitHub Repository</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    required
                                    className="block w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                                    placeholder="https://github.com/..."
                                    value={formData.githubLink}
                                    onChange={e => setFormData({...formData, githubLink: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Live Demo <span className="text-slate-400 font-normal">(Optional)</span></label>
                            <div className="relative">
                                <input
                                    type="url"
                                    className="block w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                                    placeholder="https://my-app.com"
                                    value={formData.liveDemoLink}
                                    onChange={e => setFormData({...formData, liveDemoLink: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column: Image Upload & Actions */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm h-fit sticky top-24">
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Project Image
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        Update the screenshot of your application.
                    </p>

                    <div className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 min-h-[250px] ${previewUrl ? 'border-primary-500 bg-slate-50 dark:bg-black/20' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        {previewUrl ? (
                            <div className="relative w-full h-full p-2">
                                <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-md border border-slate-200 dark:border-white/10" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white hover:bg-red-600 rounded-full p-1.5 shadow-md border-2 border-white dark:border-slate-900 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-6 w-full">
                                <div className="mx-auto h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-500 mb-4">
                                    <Upload size={32} />
                                </div>
                                <label htmlFor="file-upload" className="block relative cursor-pointer group">
                                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary-500 transition-colors text-lg">
                                        Click to Upload
                                    </span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <p className="text-xs text-slate-400 mt-2">or drag and drop here</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                        <Button type="submit" variant="primary" isLoading={saving} className="w-full h-12 text-base">
                            Save Changes
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/profile')} className="w-full h-12 text-base">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

        </form>
      </div>
    </div>
  );
};

export default EditProject;