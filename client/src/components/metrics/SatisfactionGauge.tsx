import React from 'react';
import { motion } from 'framer-motion';

interface SatisfactionGaugeProps {
  percentage: number;
  title?: string;
  subtitle?: string;
  className?: string;
  showSmileys?: boolean;
}

const SatisfactionGauge: React.FC<SatisfactionGaugeProps> = ({
  percentage,
  title,
  subtitle,
  className = '',
  showSmileys = true
}) => {
  // Normalize percentage between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Calculate gauge rotation degrees (from -90 to +90 degrees)
  const rotation = -90 + (normalizedPercentage / 100) * 180;
  
  // Determine color based on satisfaction level
  const getColor = () => {
    if (normalizedPercentage >= 85) return '#38B593'; // Green
    if (normalizedPercentage >= 65) return '#4BB462'; // Light green
    if (normalizedPercentage >= 50) return '#F9C74F'; // Yellow
    if (normalizedPercentage >= 30) return '#F8961E'; // Orange
    return '#F94144'; // Red
  };
  
  return (
    <motion.div 
      className={`bg-card rounded-xl p-6 shadow-sm border ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="font-bold text-lg mb-1 text-center">{title}</h3>}
      {subtitle && <p className="text-muted-foreground text-sm mb-4 text-center">{subtitle}</p>}
      
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Gauge background */}
          <div className="w-44 h-22 bg-muted rounded-t-full overflow-hidden">
            <div className="w-full h-full rounded-t-full border-8 border-transparent"></div>
          </div>
          
          {/* Gauge needle */}
          <motion.div 
            className="absolute top-0 left-1/2 h-24 w-1 bg-foreground origin-bottom"
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
            style={{ 
              transformOrigin: 'bottom center',
            }}
          >
            <div className="w-3 h-3 rounded-full bg-foreground absolute -left-1 -top-1.5"></div>
          </motion.div>
          
          {/* Percentage display */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ color: getColor() }}
            >
              {normalizedPercentage}%
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scale markers */}
      <div className="flex justify-between px-6 mb-2">
        <span className="text-xs">0%</span>
        <span className="text-xs">25%</span>
        <span className="text-xs">50%</span>
        <span className="text-xs">75%</span>
        <span className="text-xs">100%</span>
      </div>
      
      {/* Emoji faces */}
      {showSmileys && (
        <div className="flex justify-between px-8">
          <span className="text-lg">😢</span>
          <span className="text-lg">😐</span>
          <span className="text-lg">😊</span>
        </div>
      )}
    </motion.div>
  );
};

export default SatisfactionGauge;