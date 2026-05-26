import { useContext, useCallback } from 'react';
import { WorkspaceContext } from '../store/workspace.context.jsx';
import { startSandbox } from '../services/sandbox.api.js';

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider");

  const { setSandboxId, setPreviewUrl, setIsLoading, setError, ...state } = context;

  const handleStartSandbox = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await startSandbox();
      setSandboxId(data.sandboxId);
      setPreviewUrl(data.previewUrl);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setSandboxId, setPreviewUrl, setIsLoading, setError]);

  const exitWorkspace = useCallback(() => {
    setSandboxId(null);
    setPreviewUrl(null);
  }, [setSandboxId, setPreviewUrl]);

  return {
    ...state,
    handleStartSandbox,
    exitWorkspace
  };
}
