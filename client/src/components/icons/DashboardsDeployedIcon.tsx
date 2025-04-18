import React from 'react';

const DashboardsDeployedIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
      <circle cx="16" cy="16" r="3" />
      <path d="M12 7V7.01" />
      <path d="M16 7V7.01" />
      <path d="M7 7V7.01" />
    </svg>
  );
};

export default DashboardsDeployedIcon;