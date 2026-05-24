import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, MonitorPlay } from 'lucide-react';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';

export default function PreviewPanel() {
  const { previewUrl } = useWorkspace();
  const [key, setKey] = useState(0);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    if (previewUrl) {
      setIsBooting(true);
      const timer = setTimeout(() => {
        setIsBooting(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [previewUrl]);

  const handleRefresh = () => setKey(k => k + 1);

  if (!previewUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 bg-slate-900 rounded-lg border border-slate-800">
        <MonitorPlay className="w-8 h-8 opacity-50 mb-2" />
        <p>Preview not available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
      {/* Browser Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-3 py-1 text-xs text-slate-400 font-mono truncate">
            {previewUrl}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="p-1.5 text-slate-400 hover:text-slate-100 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-slate-100 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative bg-white flex items-center justify-center">
        {isBooting ? (
          <div className="flex flex-col items-center justify-center text-slate-400 bg-slate-900 absolute inset-0 z-10">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-sm">Booting dev server...</p>
          </div>
        ) : null}
        
        <iframe
          key={key}
          src={previewUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Live Preview"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}
