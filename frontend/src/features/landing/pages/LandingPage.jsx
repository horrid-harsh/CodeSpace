import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Code2, Sparkles, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';
import { cn } from '../../../lib/utils.js';

export default function LandingPage() {
  const { handleStartSandbox, sandboxId, isLoading, error } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (sandboxId) {
      navigate('/workspace');
    }
  }, [sandboxId, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Workspace</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
          Build software at the <br className="hidden md:block" /> speed of thought.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Experience a cinematic, AI-native development environment. Instantly provision sandboxes, stream code generation, and preview in real-time.
        </p>

        {/* CTA Action */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleStartSandbox}
            disabled={isLoading}
            className={cn(
              "group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-900 rounded-xl font-semibold text-lg transition-all duration-300",
              "hover:bg-white hover:scale-[1.02] active:scale-[0.98]",
              "glow-purple disabled:opacity-70 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                <span>Initializing Environment...</span>
              </>
            ) : (
              <>
                <span>Launch Workspace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          {error && (
            <p className="text-red-400 text-sm glass-panel px-4 py-2 mt-4 border-red-500/20">
              Failed to start sandbox: {error.message || "Unknown error"}
            </p>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-20 text-left">
          <FeatureCard
            icon={<Code2 className="w-6 h-6 text-purple-400" />}
            title="AI Code Generation"
            desc="Real-time streaming agent writes and refactors code instantly."
          />
          <FeatureCard
            icon={<Terminal className="w-6 h-6 text-orange-400" />}
            title="Cloud Terminal"
            desc="Full xterm.js integration connected to an isolated container."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-blue-400" />}
            title="Live Preview"
            desc="Instantly view changes with lightning-fast Vite HMR."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
