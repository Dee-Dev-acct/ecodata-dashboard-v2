import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { LucideIcon } from 'lucide-react';

interface AnimatedCounterProps {
  value: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  color?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  title,
  description,
  icon,
  suffix = '',
  prefix = '',
  duration = 2.5,
  className = '',
  color = 'text-primary'
}) => {
  return (
    <motion.div 
      className={`bg-card rounded-xl p-6 shadow-sm border text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {icon && (
        <div className={`flex justify-center mb-4 ${color}`}>
          {icon}
        </div>
      )}
      
      <h3 className="font-bold text-3xl mb-2">
        {prefix}
        <CountUp 
          end={value} 
          duration={duration}
          separator="," 
        />
        {suffix}
      </h3>
      
      <h4 className="font-medium text-xl mb-2">{title}</h4>
      
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </motion.div>
  );
};

export default AnimatedCounter;