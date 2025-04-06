import React from 'react';
import { motion } from 'framer-motion';

interface ContributionDay {
  day?: string;
  date?: string;
  count: number;
}

interface GitHubActivityProps {
  data?: ContributionDay[];
  contributions?: ContributionDay[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const GitHubActivity: React.FC<GitHubActivityProps> = ({
  data,
  contributions,
  title,
  subtitle,
  className = ''
}) => {
  // Use the data or contributions prop
  const contributionsData = data || contributions || [];
  
  // Find the max contribution count to determine color intensity
  const maxCount = Math.max(...contributionsData.map(day => day.count));
  
  // Function to determine intensity of the color based on count
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted';
    
    const intensity = Math.min(Math.ceil((count / maxCount) * 4), 4);
    
    switch (intensity) {
      case 1: return 'bg-primary/20';
      case 2: return 'bg-primary/40';
      case 3: return 'bg-primary/70';
      case 4: return 'bg-primary';
      default: return 'bg-muted';
    }
  };
  
  // Group data by week (rows) for the heat map
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  
  contributionsData.forEach((day, index) => {
    currentWeek.push(day);
    
    // Every 7 days (or at the end), start a new week
    if ((index + 1) % 7 === 0 || index === contributionsData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  return (
    <motion.div 
      className={`bg-card rounded-xl p-6 shadow-sm border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
      {subtitle && <p className="text-muted-foreground text-sm mb-4">{subtitle}</p>}
      
      <div className="overflow-x-auto">
        <div className="grid grid-flow-col gap-1 min-w-[500px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-flow-row gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getIntensity(day.count)}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
        <div>Less</div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
          <div className="w-3 h-3 rounded-sm bg-primary"></div>
        </div>
        <div>More</div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="font-medium text-xl">
          {contributionsData.reduce((sum, day) => sum + day.count, 0)} contributions
        </div>
        <div className="text-sm text-muted-foreground">
          in the last {contributionsData.length} days
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubActivity;