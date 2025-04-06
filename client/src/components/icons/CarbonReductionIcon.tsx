import React from 'react';

const CarbonReductionIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <path d="M12 3v12" />
      <path d="M8 8l4-4 4 4" />
      <path d="M14.3 17.7a8 8 0 0 1-11.3 0M21 17.7a8 8 0 0 0-2.7-5.7" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="19" r="1" />
      <path d="M16 14a4 4 0 0 0-8 0" />
    </svg>
  );
};

export default CarbonReductionIcon;