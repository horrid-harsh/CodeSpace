import React, { createContext, useMemo, useState } from 'react';

export const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Editor / Tabs State
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const openFile = (path) => {
    setOpenFiles((prev) => {
      if (!prev.includes(path)) {
        return [...prev, path];
      }
      return prev;
    });
    setActiveFile(path);
  };

  const closeFile = (path) => {
    setOpenFiles((prev) => {
      const newFiles = prev.filter((f) => f !== path);
      if (activeFile === path) {
        // If we closed the active file, switch to the last open one, or null
        setActiveFile(newFiles.length > 0 ? newFiles[newFiles.length - 1] : null);
      }
      return newFiles;
    });
  };

  const value = useMemo(() => ({
    sandboxId,
    previewUrl,
    isLoading,
    error,
    openFiles,
    activeFile,
    setSandboxId,
    setPreviewUrl,
    setIsLoading,
    setError,
    setActiveFile,
    openFile,
    closeFile
  }), [sandboxId, previewUrl, isLoading, error, openFiles, activeFile]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
