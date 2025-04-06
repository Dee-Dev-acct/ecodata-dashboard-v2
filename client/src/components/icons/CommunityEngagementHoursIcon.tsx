import React from 'react';

const CommunityEngagementHoursIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h1a4 4 0 0 1 0 8H2" />
      <path d="M6 9v6" />
      <path d="M14 9v6" />
    </svg>
  );
};

export default CommunityEngagementHoursIcon;