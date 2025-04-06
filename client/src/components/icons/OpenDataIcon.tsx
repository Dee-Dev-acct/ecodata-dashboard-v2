import React from 'react';

const OpenDataIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
      <path d="M16 2v4" />
      <path d="M8 6V2" />
      <path d="M12 2v4" />
      <path d="M3 10h18" />
      <path d="M12 12v6" />
      <path d="M9 15h6" />
    </svg>
  );
};

export default OpenDataIcon;