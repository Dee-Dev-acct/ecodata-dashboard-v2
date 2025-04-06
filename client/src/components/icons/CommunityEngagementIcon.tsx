import React from 'react';

const CommunityEngagementIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M12 17v-2" />
      <path d="M8 17v-2" />
      <path d="M16 17v-2" />
    </svg>
  );
};

export default CommunityEngagementIcon;