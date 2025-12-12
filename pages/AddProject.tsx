import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProject } from '../services/firebase';
import { uploadImage } from '../services/imgbb';
import { ProjectCategory } from '../types';
import { Button } from '../components/UI/Button';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { convertImageToWebP } from '../utils/imageUtils';

const AddProject: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveDemoLink: '',
    category: ProjectCategory.Web,
    techStack: '',
  });

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
    
    if (!currentUser || !imageFile) {
        showToast("Please select an image for your project.", "error");
        return;
    }

    if (!acceptedTerms) {
        showToast("You must accept the Terms and Conditions to publish your project.", "error");
        return;
    }

    setLoading(true);

    try {
      let imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"; // Default Placeholder
      
      try {
        // Convert image to WebP before uploading
        const webpImage = await convertImageToWebP(imageFile);

        // Create a timeout promise that rejects after 20 seconds
        const timeoutPromise = new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error("Upload timed out")), 10000);
        });

        // Race the upload against the timeout
        imageUrl = await Promise.race([uploadImage(webpImage), timeoutPromise]);
        
      } catch (uploadError: any) {
        console.error("Image upload issue:", uploadError);
        if (uploadError.message === "Upload timed out") {
            showToast("Image upload timed out (10s). Using default placeholder.", "error");
        } else {
            showToast("Image upload failed. Using default placeholder.", "error");
        }
      }

      const stackArray = formData.techStack.split(',').map(item => item.trim()).filter(i => i.length > 0);

      await createProject({
        title: formData.title,
        description: formData.description,
        githubLink: formData.githubLink,
        liveDemoLink: formData.liveDemoLink,
        category: formData.category,
        techStack: stackArray,
        imageUrl: imageUrl,
        userId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous',
        createdAt: Date.now()
      });

      showToast("Project created successfully!", "success");
      navigate('/applications');
    } catch (error) {
      console.error("Error creating project", error);
      showToast("Failed to create project", "error");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Submit a Project</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Showcase your best work to the community.</p>
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
                                    placeholder="Briefly describe what your project does, the problem it solves, and its key features..."
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
                        Upload a high-quality screenshot of your application.
                        <br />
                        <span className="font-semibold text-primary-600 dark:text-primary-400">Recommended Size:</span> 4:3 Aspect Ratio.
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
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold mt-4 bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded inline-block">
                                    Max 3MB
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                        
                        {/* Terms & Conditions Checkbox */}
                        <div className="flex items-start gap-3 px-1">
                             <div className="flex h-6 items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
                                />
                             </div>
                             <div className="text-sm leading-6">
                                <label htmlFor="terms" className="text-slate-600 dark:text-slate-400 font-medium">
                                    I accept the <button type="button" onClick={() => setShowTermsModal(true)} className="text-primary-600 dark:text-primary-400 font-bold hover:underline focus:outline-none">Terms and Conditions</button>
                                </label>
                             </div>
                        </div>

                        <Button type="submit" variant="primary" isLoading={loading} className="w-full h-12 text-base">
                            Publish Project
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/')} className="w-full h-12 text-base">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

        </form>

        {/* Terms & Conditions Modal */}
        {showTermsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-white/10 shrink-0">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Terms & Conditions for Dharohar</h3>
                        <button onClick={() => setShowTermsModal(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Modal Content - Scrollable */}
                    <div className="p-8 overflow-y-auto prose dark:prose-invert prose-slate max-w-none text-slate-600 dark:text-slate-300">
                        
                        <h4 className="font-bold text-slate-900 dark:text-white">1. Introduction</h4>
                        <p>These Terms & Conditions govern the use of the Dharohar (“Platform”), where students can submit their academic or personal projects by providing a GitHub repository link and a live deployment link. By submitting a project, the user (“Student”) agrees to comply with all rules stated below.</p>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">2. Eligibility</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Only students are permitted to submit projects.</li>
                            <li>Users must submit projects they have personally created or co-created.</li>
                            <li>Submissions representing copied, stolen, or misattributed work are strictly prohibited.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">3. Submission Requirements</h4>
                        <p>Each student must provide accurate and complete information during the submission process, including:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li><strong>Project Title</strong></li>
                            <li><strong>Project Description</strong></li>
                            <li><strong>Tech Stack Used</strong></li>
                            <li><strong>Public GitHub Repository Link</strong></li>
                            <li><strong>Live Deployment Link</strong></li>
                            <li><strong>Project Category</strong></li>
                        </ol>
                        <p className="mt-2 text-sm italic">Incomplete submissions will be automatically rejected.</p>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">4. GitHub Repository Standards</h4>
                        <p>To maintain quality and authenticity:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The GitHub repository <strong>must be public</strong>. Private repositories will not be reviewed.</li>
                            <li>The repository must contain the full project source code.</li>
                            <li>A <code>README.md</code> file is required, containing:
                                <ul className="list-circle pl-5 mt-1">
                                    <li>Project overview</li>
                                    <li>Setup instructions</li>
                                    <li>Features or functionality description</li>
                                </ul>
                            </li>
                            <li>Repositories containing malware, irrelevant content, non-functional code, or plagiarized work will be rejected and may result in account suspension.</li>
                            <li>Students must not expose sensitive information such as API keys, database credentials, tokens, or passwords.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">5. Live Deployment Requirements</h4>
                        <p>The submitted live link must meet these conditions:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The project must be accessible without requiring login, payment, or additional permissions.</li>
                            <li>The project must load properly and match the functionality described in the GitHub repository.</li>
                            <li>Links that redirect to unrelated, unsafe, or inappropriate websites will lead to immediate rejection.</li>
                            <li>If the live link becomes inaccessible for more than 7 consecutive days, the platform reserves the right to remove the project.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">6. Content Restrictions</h4>
                        <p>Projects must not include or promote:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Offensive, discriminatory, or harmful content</li>
                            <li>Illegal activities</li>
                            <li>Copyrighted material without permission</li>
                            <li>Explicit, violent, or inappropriate media</li>
                            <li>Security vulnerabilities or malicious scripts</li>
                        </ul>
                        <p className="mt-2 text-sm">Violations will result in removal of the project and potential permanent suspension of the student.</p>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">7. Review & Moderation</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All submissions will be reviewed manually by platform administrators.</li>
                            <li>The platform reserves full authority to accept, reject, modify, or remove any project at any time.</li>
                            <li>Projects may be removed if:
                                <ul className="list-circle pl-5 mt-1">
                                    <li>The GitHub repo becomes private or is deleted</li>
                                    <li>The live link is broken or unreachable</li>
                                    <li>Plagiarism or rule violations are identified</li>
                                    <li>The project fails to meet updated platform standards</li>
                                </ul>
                            </li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">8. Student Responsibilities</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Students must ensure that all submitted information is accurate and up to date.</li>
                            <li>Students must update links if repositories are moved or hosting changes.</li>
                            <li>Students are responsible for ensuring their submission does not infringe on any copyrights.</li>
                            <li>Any attempt to submit fraudulent projects, fake links, or spam will result in a permanent ban.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">9. Platform Rights</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The platform may display, categorize, and showcase submitted projects for educational and informational purposes.</li>
                            <li>The platform does not claim ownership of any project; all rights remain with the student.</li>
                            <li>The platform may modify these Terms & Conditions at any time. Continued use of the platform indicates acceptance of changes.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">10. Liability Disclaimer</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The platform is not responsible for the accuracy, security, or reliability of external GitHub or live links.</li>
                            <li>The platform is not liable for any damage, data loss, or issues arising from accessing third-party links.</li>
                            <li>Students submit their work at their own risk and are responsible for any potential misuse of exposed source code.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">11. Privacy</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The platform will store and display submitted information publicly unless stated otherwise.</li>
                            <li>Students must avoid sharing sensitive personal information in their submissions.</li>
                        </ul>

                        <h4 className="font-bold text-slate-900 dark:text-white mt-6">12. Acceptance of Terms</h4>
                        <p>By submitting a project, the student acknowledges they have read, understood, and agree to abide by these Terms & Conditions without exception.</p>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-slate-200 dark:border-white/10 flex justify-end bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl shrink-0">
                        <Button 
                            onClick={() => {
                                setAcceptedTerms(true); 
                                setShowTermsModal(false);
                            }} 
                            variant="primary"
                            className="px-8"
                        >
                            I Accept
                        </Button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AddProject;