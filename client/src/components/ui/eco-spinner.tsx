import React from 'react';
import { cn } from '@/lib/utils';

interface EcoSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
}

export function EcoSpinner({ 
  size = 'md', 
  className = '',
  message 
}: EcoSpinnerProps) {
  // Map size to pixel values
  const sizeMap = {
    'xs': { container: 'w-10 h-10', svg: 'w-6 h-6', text: 'text-xs' },
    'sm': { container: 'w-16 h-16', svg: 'w-10 h-10', text: 'text-sm' },
    'md': { container: 'w-24 h-24', svg: 'w-14 h-14', text: 'text-base' },
    'lg': { container: 'w-32 h-32', svg: 'w-20 h-20', text: 'text-lg' },
    'xl': { container: 'w-40 h-40', svg: 'w-24 h-24', text: 'text-xl' },
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center', 
      className
    )}>
      <div className={cn(
        "relative flex items-center justify-center",
        sizeMap[size].container
      )}>
        {/* Circular background */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
        
        {/* Leaf SVG with animation */}
        <svg 
          className={cn(
            "text-primary animate-grow-rotate", 
            sizeMap[size].svg
          )} 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            className="animate-fill-path" 
            d="M21 4.5C17.5034 4.5 12.5 5.5 8.5 9.5C4.5 13.5 4.5 19 4.5 19M4.5 19L4.5 19.0108M4.5 19L9 19M4.5 19L4.5 14.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            className="animate-fill-path-delay" 
            d="M21 4.5C21 4.5 21 8.5 20.5 10.5C20 12.5 19 15 16.5 17.5C14 20 11 21 8 21C7 21 5.5 21 4.5 19M12 8C12.5 9 13.5 11.5 15.5 13.5C17.5 15.5 20 16.5 21 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {message && (
        <p className={cn(
          "mt-4 text-muted-foreground animate-fade-in",
          sizeMap[size].text
        )}>
          {message}
        </p>
      )}
    </div>
  );
}

// Mini version specifically for buttons and inline usage
export function EcoSpinnerMini({ className }: { className?: string }) {
  return (
    <svg 
      className={cn(
        "w-4 h-4 text-current animate-spin", 
        className
      )} 
      viewBox="0 0 24 24" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M21 4.5C17.5034 4.5 12.5 5.5 8.5 9.5C4.5 13.5 4.5 19 4.5 19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M21 4.5C21 4.5 21 8.5 20.5 10.5C20 12.5 19 15 16.5 17.5C14 20 11 21 8 21C7 21 5.5 21 4.5 19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}