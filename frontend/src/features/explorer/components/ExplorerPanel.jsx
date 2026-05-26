import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';
import { ChevronRight, ChevronDown, FileIcon, FolderIcon, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

// Helper to convert flat file paths into a nested tree structure
function buildFileTree(files) {
  const root = { name: 'root', type: 'directory', children: {}, path: '' };

  files.forEach(filePath => {
    const parts = filePath.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (!current.children[part]) {
        const isFile = index === parts.length - 1;
        current.children[part] = {
          name: part,
          type: isFile ? 'file' : 'directory',
          path: parts.slice(0, index + 1).join('/'),
          ...(isFile ? {} : { children: {} }),
        };
      }
      current = current.children[part];
    });
  });

  return root;
}

const sortNodes = (nodesMap) => {
  return Object.values(nodesMap).sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1; // Folders first
    }
    return a.name.localeCompare(b.name);
  });
};

const FileTreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false); // VS Code defaults to closed, or maybe open for root level?
  const { activeFile, openFile } = useWorkspace();
  const isDir = node.type === 'directory';
  const isActive = activeFile === node.path;

  // Auto-expand root slightly
  useEffect(() => {
    if (level === 0) setIsOpen(true);
  }, [level]);

  if (node.name === 'root') {
    return (
      <div>
        {sortNodes(node.children || {}).map(child => (
          <FileTreeNode key={child.path} node={child} level={level} />
        ))}
      </div>
    );
  }

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDir) {
      setIsOpen(!isOpen);
    } else {
      openFile(node.path);
    }
  };

  return (
    <div>
      <div
        className={clsx(
          "flex items-center py-1 cursor-pointer text-sm transition-colors border-l-2 group select-none",
          isActive 
            ? "bg-[#37373D] text-white border-blue-500" // VS Code active color
            : "text-slate-300 hover:bg-[#2A2D2E] border-transparent",
          !isDir && !isActive && "hover:text-slate-100"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px`, paddingRight: '8px' }}
        onClick={handleClick}
      >
        <span className="w-4 h-4 mr-1 flex items-center justify-center opacity-80 group-hover:opacity-100">
          {isDir ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : null}
        </span>
        <span className="mr-1.5 opacity-80 group-hover:opacity-100 text-blue-400">
          {isDir ? <FolderIcon size={14} fill={isOpen ? "currentColor" : "none"} /> : <FileIcon size={14} className="text-slate-400" />}
        </span>
        <span className="truncate">{node.name}</span>
      </div>

      {isDir && isOpen && node.children && (
        <div>
          {sortNodes(node.children).map(child => (
            <FileTreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ExplorerPanel() {
  const { sandboxId } = useWorkspace();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `http://${sandboxId}.agent.localhost/list-files`;
      
      const response = await axios.get(url);
      setFiles(response.data.files || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sandboxId) {
      fetchFiles();
    }
  }, [sandboxId]);

  const fileTree = useMemo(() => buildFileTree(files), [files]);

  return (
    <div className="flex flex-col h-full w-full bg-[#1E1E1E]"> {/* VS Code dark theme background */}
      <div className="h-9 flex items-center justify-between px-4 shrink-0">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Explorer</h2>
        <button 
          onClick={fetchFiles}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={13} className={clsx(isLoading && "animate-spin")} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-4">
        {error ? (
          <div className="px-4 py-2 text-red-400 text-xs">{error}</div>
        ) : isLoading && files.length === 0 ? (
          <div className="px-4 py-2 text-slate-500 text-xs">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="px-4 py-2 text-slate-500 text-xs">Workspace is empty.</div>
        ) : (
          <FileTreeNode node={fileTree} />
        )}
      </div>
    </div>
  );
}
