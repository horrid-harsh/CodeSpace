import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function EditorPanel() {
  const { activeFile, sandboxId } = useWorkspace();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeFile || !sandboxId) return;

    let isMounted = true;
    const fetchFile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `http://${sandboxId}.agent.localhost/read-files?files=${encodeURIComponent(activeFile)}`;
        
        const response = await axios.get(url);
        const data = response.data;
        // data.files is an array of objects: [{ "/path/to/file": "content" }]
        const fileData = data.files.find(f => Object.keys(f)[0] === '/' + activeFile || Object.keys(f)[0] === activeFile);
        
        if (isMounted) {
          if (fileData) {
            const fileContent = Object.values(fileData)[0];
            setContent(fileContent.startsWith('Error') ? '// ' + fileContent : fileContent);
          } else {
            setContent('// File not found or empty');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setContent(`// Error loading file: ${err.message}`);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFile();

    return () => {
      isMounted = false;
    };
  }, [activeFile, sandboxId]);

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleSave = async (value, event) => {
    // Prevent default browser save
    if (event) {
        event.preventDefault();
    }

    try {
      const url = `http://${sandboxId}.agent.localhost/update-files`;
      
      await axios.patch(url, {
        updates: [{ file: activeFile, content: value }]
      });
      // Could show a toast or small indicator here
    } catch (err) {
      console.error('Error saving file:', err);
      alert('Failed to save file: ' + err.message);
    }
  };

  const determineLanguage = (path) => {
    if (!path) return 'javascript';
    if (path.endsWith('.jsx')) return 'javascript'; // Monaco handles JSX mostly okay in JS mode, but there is typescript/javascript react
    if (path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    return 'javascript';
  };

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#1E1E1E] text-slate-500">
        <p>Select a file to start editing</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-[#1E1E1E]">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-[#1E1E1E]/50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
      <Editor
        height="100%"
        theme="vs-dark"
        path={activeFile} // helps monaco with syntax resolution
        language={determineLanguage(activeFile)}
        value={content}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          wordWrap: 'on',
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
        }}
        onMount={(editor, monaco) => {
          // Add save shortcut
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            handleSave(editor.getValue());
          });
        }}
      />
    </div>
  );
}
