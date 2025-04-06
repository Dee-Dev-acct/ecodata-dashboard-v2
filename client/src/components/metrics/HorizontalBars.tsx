import React from 'react';
import { motion } from 'framer-motion';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarsProps {
  data: BarData[];
  title?: string;
  subtitle?: string;
  maxValue?: number;
  showValues?: boolean;
  className?: string;
}

const HorizontalBars: React.FC<HorizontalBarsProps> = ({
  data,
  title,
  subtitle,
  maxValue,
  showValues = true,
  className = ''
}) => {
  // If maxValue is not provided, find the highest value in the data
  const highestValue = maxValue || Math.max(...data.map(item => item.value));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (value: number) => ({
      width: `${(value / highestValue) * 100}%`,
      transition: { duration: 1, ease: "easeOut" }
    })
  };

  return (
    <motion.div 
      className={`bg-card rounded-xl p-6 shadow-sm border ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
      {subtitle && <p className="text-muted-foreground text-sm mb-4">{subtitle}</p>}
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              {showValues && <span className="font-medium">{item.value}</span>}
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ backgroundColor: item.color || '#2A9D8F' }}
                custom={item.value}
                variants={barVariants}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HorizontalBars;