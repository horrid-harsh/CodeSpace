import React from 'react';

export function IdleWarningBanner({ visible, onStayActive, secondsRemaining }) {
  if (!visible) return null;

  return (
    <div className="
      fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-4
      bg-yellow-950 border border-yellow-700
      text-yellow-200 text-sm
      px-5 py-3 rounded-xl shadow-xl
      animate-[slideUp_0.3s_ease-out]
    ">
      <span className="text-yellow-400 text-base">⚠</span>
      <span>
        Your workspace is idle —{' '}
        <strong>pod will be deleted in ~{secondsRemaining}s</strong>
      </span>
      <button
        onClick={onStayActive}
        className="
          ml-2 px-3 py-1 rounded-md
          bg-yellow-700 hover:bg-yellow-600
          text-yellow-100 font-medium text-xs
          transition-colors cursor-pointer
        "
      >
        Keep alive
      </button>
    </div>
  );
}
