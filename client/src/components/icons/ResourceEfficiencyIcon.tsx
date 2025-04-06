import React from 'react';

const ResourceEfficiencyIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <path d="M12 12c-3-2.5-3-6.5 0-9 3 2.5 3 6.5 0 9z" />
      <path d="M12 12c2.5-3 6.5-3 9 0-2.5 3-6.5 3-9 0z" />
      <path d="M12 12c-2.5-3-6.5-3-9 0 2.5 3 6.5 3 9 0z" />
      <path d="M12 12c3 2.5 3 6.5 0 9-3-2.5-3-6.5 0-9z" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
};

export default ResourceEfficiencyIcon;