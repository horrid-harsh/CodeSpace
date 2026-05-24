export const invokeAI = async (message, projectId, onChunk) => {
  const response = await fetch('/api/ai/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, projectId })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // The last part is either incomplete or empty, keep it in the buffer
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          // Strip "data: " prefix commonly used in SSE (Server-Sent Events)
          const jsonStr = line.replace(/^data:\s*/, '');
          const parsed = JSON.parse(jsonStr);
          if (parsed.log) {
            onChunk(parsed.log);
          }
        } catch (e) {
          console.error("Failed to parse log chunk", line);
        }
      }
    }
  }

  // Handle any remaining content in the buffer
  if (buffer.trim()) {
    try {
      const jsonStr = buffer.replace(/^data:\s*/, '');
      const parsed = JSON.parse(jsonStr);
      if (parsed.log) {
        onChunk(parsed.log);
      }
    } catch (e) {
      console.error("Failed to parse log chunk", buffer);
    }
  }
};
