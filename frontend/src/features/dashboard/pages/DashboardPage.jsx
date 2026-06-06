import React, { useState } from 'react';
import { Plus, Search, LogOut, Settings, Folder, Activity, Terminal, PanelLeftClose, PanelLeftOpen, X, Globe, Server, Smartphone, Brain, Database, Shield, GitBranch, Clock, Code2, Zap, ShieldCheck, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dummyProjects = [
  { 
    id: 1, 
    name: 'Portfolio Site', 
    type: 'Web App',
    description: 'Personal portfolio with dark theme and smooth animations',
    techStack: [{ name: 'TypeScript', color: 'bg-orange-500' }, { name: 'React', color: 'bg-blue-500' }, { name: 'Next.js', color: 'bg-purple-500' }],
    branch: 'main',
    updated: '2h ago', 
    status: 'Active',
    icon: 'Globe'
  },
  { 
    id: 2, 
    name: 'API Gateway', 
    type: 'Backend',
    description: 'Microservices gateway with rate limiting and auth middleware',
    techStack: [{ name: 'Go', color: 'bg-emerald-500' }, { name: 'Docker', color: 'bg-blue-600' }],
    branch: 'develop',
    updated: '5h ago', 
    status: 'Active',
    icon: 'Server'
  },
  { 
    id: 3, 
    name: 'Mobile Wallet', 
    type: 'Mobile',
    description: 'Cross-platform crypto wallet with biometric authentication',
    techStack: [{ name: 'Flutter', color: 'bg-blue-400' }, { name: 'Dart', color: 'bg-red-500' }],
    branch: 'feature/auth',
    updated: '1d ago', 
    status: 'Building',
    icon: 'Smartphone'
  },
  { 
    id: 4, 
    name: 'LLM Playground', 
    type: 'ML / AI',
    description: 'Experimental sandbox for fine-tuning and prompt engineering',
    techStack: [{ name: 'Python', color: 'bg-yellow-500' }, { name: 'PyTorch', color: 'bg-purple-600' }],
    branch: 'experiments',
    updated: '3d ago', 
    status: 'Active',
    icon: 'Brain'
  },
  { 
    id: 5, 
    name: 'Data Pipeline', 
    type: 'Data',
    description: 'ETL pipeline for real-time analytics and data warehousing',
    techStack: [{ name: 'Python', color: 'bg-yellow-500' }, { name: 'Kafka', color: 'bg-emerald-600' }],
    branch: 'main',
    updated: '1w ago', 
    status: 'Paused',
    icon: 'Database'
  },
  { 
    id: 6, 
    name: 'Auth Service', 
    type: 'Security',
    description: 'Zero-trust authentication with OAuth2 and PKCE flow support',
    techStack: [{ name: 'Rust', color: 'bg-orange-600' }, { name: 'gRPC', color: 'bg-blue-500' }],
    branch: 'release/v2',
    updated: '2d ago', 
    status: 'Review',
    icon: 'Shield'
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const handleLogout = () => {
    // Dummy logout for now
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`border-r border-white/10 bg-neutral-900/30 backdrop-blur-xl flex-col justify-between hidden md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 overflow-hidden">
          <div className={`flex items-center mb-8 cursor-pointer ${isCollapsed ? 'justify-center' : 'gap-2'}`} onClick={() => navigate('/')}>
            <img src="/logo-favicon.png" alt="Codespace Logo" className="w-7 h-7 shrink-0" />
            {!isCollapsed && <span className="font-bold text-xl tracking-tight truncate">Codespace</span>}
          </div>

          <nav className="space-y-2">
            <button className={`flex items-center w-full px-4 py-2.5 bg-white/10 text-white rounded-lg transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'gap-3'}`} title="Projects">
              <Folder className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium truncate">Projects</span>}
            </button>
            <button className={`flex items-center w-full px-4 py-2.5 text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'gap-3'}`} title="Activity">
              <Activity className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium truncate">Activity</span>}
            </button>
            <button className={`flex items-center w-full px-4 py-2.5 text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'gap-3'}`} title="Settings">
              <Settings className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium truncate">Settings</span>}
            </button>
          </nav>
        </div>

        <div className={`p-6 border-t border-white/10 flex ${isCollapsed ? 'flex-col gap-4 items-center' : 'items-center justify-between'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-neutral-900 border-2 border-transparent" />
            </div>
            {!isCollapsed && <p className="text-sm font-medium text-white truncate">Guest User</p>}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2 text-[#a1a1a1] hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 gap-4 md:gap-0">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center md:hidden shrink-0">
                <img src="/logo-favicon.png" alt="Codespace Logo" className="w-6 h-6" style={{ filter: 'brightness(0)' }} />
              </div>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden md:block cursor-pointer"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-[22px] md:text-2xl font-bold tracking-tight text-white leading-none">My Projects</h1>
                <p className="text-[11px] text-[#888888] md:hidden mt-1 font-medium">Manage your codespaces</p>
              </div>
            </div>
            
            <button 
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center md:hidden shrink-0 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-[#121212] md:bg-neutral-900 border border-white/5 md:border-white/10 text-[13px] md:text-sm rounded-xl md:rounded-full pl-10 pr-4 py-2.5 md:py-2 w-full md:w-64 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div className="hidden md:block">
              <button className="btn-new-project cursor-pointer shrink-0" onClick={() => setIsModalOpen(true)}>
                New Project
                <Plus className="icon" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full pb-28 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyProjects.map((project) => {
              const IconComponent = {
                Globe, Server, Smartphone, Brain, Database, Shield
              }[project.icon] || Folder;

              const getStatusColor = (status) => {
                switch (status) {
                  case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  case 'Building': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                  case 'Paused': return 'bg-red-500/10 text-red-400 border-red-500/20';
                  case 'Review': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                  default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
                }
              };

              const getStatusDot = (status) => {
                switch (status) {
                  case 'Active': return 'bg-emerald-400';
                  case 'Building': return 'bg-yellow-500';
                  case 'Paused': return 'bg-red-400';
                  case 'Review': return 'bg-purple-400';
                  default: return 'bg-neutral-400';
                }
              };

              return (
                <div 
                  key={project.id} 
                  className="bg-[#151515] border border-white/5 rounded-2xl p-6 hover:bg-[#1a1a1a] hover:border-white/10 transition-colors cursor-pointer group flex flex-col h-full min-h-[240px]"
                >
                  {/* Top Row: Type and Status */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3 text-[#a1a1a1]">
                      <div className="p-2 bg-white/5 rounded-lg text-white/70">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{project.type}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${getStatusColor(project.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(project.status)}`} />
                      {project.status}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-white font-semibold text-[17px] tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-[#a1a1a1] text-[13px] leading-relaxed line-clamp-2 mb-6 flex-1">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {project.techStack.map((tech) => (
                      <div key={tech.name} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-md text-[11px] font-medium text-[#d1d1d1]">
                        <div className={`w-1.5 h-1.5 rounded-full ${tech.color}`} />
                        {tech.name}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto text-[#888888] text-[11px] font-medium">
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <GitBranch className="w-3.5 h-3.5" />
                      {project.branch}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {project.updated}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {dummyProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center mt-10">
              {/* Icon Container */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-neutral-800/20 blur-3xl rounded-full"></div>
                <div className="w-28 h-28 rounded-3xl bg-[#111111] border border-white/5 flex items-center justify-center relative shadow-2xl">
                  <Folder className="w-12 h-12 text-neutral-400 stroke-[1.5]" />
                  <div className="absolute top-7 right-6 bg-[#111111] px-1 rounded">
                    <Code2 className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-[26px] font-bold mb-3 tracking-tight text-white">No projects yet</h3>
              <p className="text-[#a1a1a1] mb-10 text-sm">
                Create your first project to get started.
              </p>
              
              <button 
                className="flex items-center gap-2 text-white font-semibold hover:text-neutral-300 transition-colors cursor-pointer mb-14" 
                onClick={() => setIsModalOpen(true)}
              >
                Create Project
              </button>

              {/* Features List */}
              <div className="flex items-center gap-6 text-[13px] text-[#888888] font-medium mb-12">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Version control
                </div>
                <div className="w-[1px] h-4 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Instant setup
                </div>
                <div className="w-[1px] h-4 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Secure by default
                </div>
              </div>

              {/* Quick tip box */}
              <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 max-w-[500px] w-full text-left flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Quick tip</h4>
                  <p className="text-[#888888] text-[13px] leading-relaxed">
                    Import from GitHub, GitLab, or start from a template to spin up your environment in seconds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/5 z-40 px-2 pb-2 pt-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1.5 p-2 text-white w-16">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Folder className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[10px] font-bold">Projects</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-2 text-[#888888] hover:text-white transition-colors w-16">
            <div className="w-8 h-8 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Activity</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-2 text-[#888888] hover:text-white transition-colors w-16">
            <div className="w-8 h-8 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Settings</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-2 text-[#888888] hover:text-white transition-colors w-16" onClick={handleLogout}>
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#222] border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                JD
              </div>
            </div>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white tracking-tight">Create New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label htmlFor="project-title" className="block text-sm font-medium text-[#a1a1a1] mb-2">
                Project Title
              </label>
              <input 
                id="project-title"
                type="text" 
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="e.g. my-awesome-app" 
                className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-600"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10 bg-white/[0.02]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#a1a1a1] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                className="btn-new-project disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newProjectTitle.trim()}
                onClick={() => {
                  // TODO: Handle project creation logic
                  setIsModalOpen(false);
                  setNewProjectTitle('');
                }}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
