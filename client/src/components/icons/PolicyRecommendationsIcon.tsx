import React from 'react';

const PolicyRecommendationsIcon: React.FC<{ className?: string }> = ({ className = 'h-10 w-10 text-primary' }) => {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      <path d="M16 5h6" />
      <path d="M19 2v6" />
      <path d="M2 19h6" />
      <path d="M5 16v6" />
    </svg>
  );
};

export default PolicyRecommendationsIcon;