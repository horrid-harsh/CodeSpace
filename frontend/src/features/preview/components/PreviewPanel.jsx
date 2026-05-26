import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, MonitorPlay } from 'lucide-react';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';

export default function PreviewPanel() {
  const { previewUrl, sandboxId } = useWorkspace();
  const [key, setKey] = useState(0);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    if (!previewUrl || !sandboxId) return;

    let isMounted = true;
    setIsBooting(true);

    const checkReady = async () => {
      try {
        const url = `http://${sandboxId}.agent.localhost/list-files`;
        
        const response = await fetch(url);
        if (response.ok && isMounted) {
          setIsBooting(false);
          return true;
        }
      } catch (err) {
        // Not ready yet
      }
      return false;
    };

    const poll = async () => {
      let attempts = 0;
      while (isMounted && attempts < 60) { // Try for up to 2 minutes (60 * 2s)
        const isReady = await checkReady();
        if (isReady) break;
        await new Promise(r => setTimeout(r, 2000));
        attempts++;
      }
      if (isMounted) setIsBooting(false); // Fallback
    };

    poll();

    return () => {
      isMounted = false;
    };
  }, [previewUrl, sandboxId]);

  const handleRefresh = () => setKey(k => k + 1);

  if (!previewUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 h-full w-full">
        <MonitorPlay className="w-8 h-8 opacity-50 mb-2" />
        <p>Preview not available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Browser Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 thin-border-b shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4 min-w-0 flex justify-center">
          <div className="flex items-center bg-background thin-border rounded-full px-4 py-1 text-xs text-slate-400 font-mono glow-active w-full min-w-0">
            <span className="truncate w-full text-center">{previewUrl}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleRefresh} className="p-1.5 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer">
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
          <div className="flex flex-col items-center justify-center text-slate-400 bg-background absolute inset-0 z-10">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-sm mb-4">Booting dev server...</p>
            <button 
              onClick={() => { setIsBooting(false); handleRefresh(); }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 thin-border rounded text-xs transition-colors cursor-pointer"
            >
              Force Reload
            </button>
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
