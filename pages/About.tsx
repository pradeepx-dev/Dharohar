import React from 'react';
import { Rocket, Code2, Globe, Users, Zap, Brain, Database, Smartphone, Gamepad2, Blocks, Laptop, Target, Lightbulb, Share2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.1]" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm mb-8 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                <Rocket size={14} className="text-primary-500" />
                <span>An Initiative by Developer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                Showcase. Inspire. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-400">Build the Future.</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                A dedicated platform for engineering students to list their projects, 
                sparking inspiration for upcoming engineers to build upon these foundations.
            </p>
        </div>

        {/* The Motto / Process Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent -translate-y-1/2 z-0" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {/* Card 1 */}
                    <div className="group bg-white dark:bg-[#0F0F0F] p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Share2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Showcase</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Engineering students can list their innovative projects here, creating a digital portfolio visible to the world.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="group bg-white dark:bg-[#0F0F0F] p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Lightbulb size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Inspire</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Upcoming future engineers get inspired by real-world implementations and creative solutions.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="group bg-white dark:bg-[#0F0F0F] p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Blocks size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Foundation</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Students can use these listed projects as a foundation or a component to build even more complex systems.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Categories Section */}
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-24 mb-24 transform -skew-y-2">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform skew-y-2">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div>
                        <span className="text-primary-400 dark:text-primary-600 font-bold tracking-wider uppercase text-sm">Diverse Fields</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2">Innovation has no limits.</h2>
                    </div>
                    <p className="max-w-md text-lg text-slate-400 dark:text-slate-600 font-medium">
                        From AI to Blockchain, we welcome projects from all engineering disciplines.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { name: "AI & ML", icon: <Brain />, color: "bg-purple-500" },
                        { name: "Blockchain", icon: <Blocks />, color: "bg-orange-500" },
                        { name: "Data Science", icon: <Database />, color: "bg-pink-500" },
                        { name: "Web Dev", icon: <Code2 />, color: "bg-blue-500" },
                        { name: "Mobile Apps", icon: <Smartphone />, color: "bg-green-500" },
                        { name: "Game Dev", icon: <Gamepad2 />, color: "bg-red-500" },
                    ].map((cat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 dark:bg-slate-100/50 backdrop-blur-sm border border-white/10 dark:border-slate-200 hover:bg-white/10 dark:hover:bg-slate-200/50 transition-colors cursor-default group">
                            <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                {React.cloneElement(cat.icon as any, { size: 20 })}
                            </div>
                            <span className="font-bold text-lg">{cat.name}</span>
                        </div>
                    ))}
                </div>
             </div>
        </div>

        {/* RJIT Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-100 to-white dark:from-[#0F0F0F] dark:to-black rounded-[2.5rem] p-12 border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Rocket size={40} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                        Created & Managed by <br />
                        <span className="text-primary-600 dark:text-primary-500">pradeepx-dev</span>
                    </h2>
                    
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
                        "Our motto is to create an ecosystem where knowledge is shared, not siloed. We believe every student project has the potential to be the seed for the next big innovation."
                    </p>

                    <div className="flex flex-col items-center gap-2 mb-8">
                         <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Contact Us</span>
                         <a href="#" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                             <Mail size={20} className="text-primary-500" />
                             abc@mail.com
                         </a>
                    </div>
                    
                    <div className="h-1 w-24 bg-primary-500 rounded-full mx-auto" />
                </div>
            </div>
            
            <p className="mt-12 text-slate-400 dark:text-slate-600 font-medium text-sm">
                © {new Date().getFullYear()} Dharohar •
            </p>
        </div>

      </div>
    </div>
  );
};

export default About;