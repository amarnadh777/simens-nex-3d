import React from 'react';

export function PanelCard({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#0a0a0a]/80 backdrop-blur-xl
        border border-white/5 rounded-[2rem]
        shadow-2xl overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}