import React, { createContext, useMemo, useState } from 'react';

export const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = useMemo(() => ({
    sandboxId,
    previewUrl,
    isLoading,
    error,
    setSandboxId,
    setPreviewUrl,
    setIsLoading,
    setError
  }), [sandboxId, previewUrl, isLoading, error]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
