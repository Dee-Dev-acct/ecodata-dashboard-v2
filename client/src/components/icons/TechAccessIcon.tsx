import React from 'react';

const TechAccessIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
      <path d="M8 6h8" />
      <path d="M8 10h8" />
      <path d="M8 14h2" />
      <path d="M17 22v-8l-3-2" />
      <path d="M7 22v-8l3-2" />
    </svg>
  );
};

export default TechAccessIcon;