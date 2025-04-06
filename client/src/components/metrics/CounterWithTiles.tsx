import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface Tile {
  label: string;
  value: number;
  icon?: string | React.ReactNode;
}

interface CounterWithTilesProps {
  title: string;
  subtitle?: string;
  tiles: Tile[];
  className?: string;
}

const CounterWithTiles: React.FC<CounterWithTilesProps> = ({
  title,
  subtitle,
  tiles,
  className = ''
}) => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`bg-card rounded-xl p-6 shadow-sm border ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-6">
        <h4 className="text-xl font-medium mb-2">{title}</h4>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map((tile, index) => (
          <motion.div 
            key={index}
            className="bg-muted/50 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
            variants={itemVariants}
          >
            <div className="text-4xl text-primary mb-2">
              {typeof tile.icon === 'string' ? tile.icon : tile.icon}
            </div>
            <h3 className="text-2xl font-bold mb-1">
              <CountUp end={tile.value} duration={2} />
            </h3>
            <p className="text-sm text-muted-foreground">{tile.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CounterWithTiles;