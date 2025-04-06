import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  imageUrl?: string;
}

interface CounterWithTilesProps {
  value: number;
  title: string;
  description: string;
  projects: Project[];
  className?: string;
}

const CounterWithTiles: React.FC<CounterWithTilesProps> = ({
  value,
  title,
  description,
  projects,
  className = ''
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = 2000 / end;
    
    let timer: NodeJS.Timeout;
    
    const updateCount = () => {
      start += 1;
      setCount(start);
      
      if (start < end) {
        timer = setTimeout(updateCount, incrementTime);
      }
    };
    
    timer = setTimeout(updateCount, incrementTime);
    
    return () => clearTimeout(timer);
  }, [value]);

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
        <h3 className="text-4xl font-bold mb-2">{count}</h3>
        <h4 className="text-xl font-medium mb-2">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <motion.div 
            key={index}
            className="bg-muted/50 rounded-lg p-4 hover:shadow-md transition-shadow"
            variants={itemVariants}
          >
            {project.imageUrl && (
              <div className="h-32 overflow-hidden rounded-md mb-3">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h5 className="font-medium mb-1">{project.title}</h5>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CounterWithTiles;