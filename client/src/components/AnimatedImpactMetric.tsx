import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import CountUp from 'react-countup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnimatedImpactMetricProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
  duration?: number;
  prefix?: string;
  decimals?: number;
  color?: string;
}

const AnimatedImpactMetric: React.FC<AnimatedImpactMetricProps> = ({
  title,
  value,
  unit,
  description,
  icon,
  delay = 0,
  duration = 2.5,
  prefix = "",
  decimals = 0,
  color = "green"
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const controls = useAnimation();
  
  // Map of color classes
  const colorClasses: { [key: string]: string } = {
    green: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
    teal: "text-teal-600 dark:text-teal-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };
  
  const colorClass = colorClasses[color] || colorClasses.green;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: delay * 0.2 }
      });
      setHasAnimated(true);
    }
  }, [inView, controls, hasAnimated, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            {icon && <div className={`${colorClass}`}>{icon}</div>}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className={`text-3xl font-bold ${colorClass}`}>
              {prefix}
              {inView ? (
                <CountUp
                  start={0}
                  end={value}
                  duration={duration}
                  delay={delay}
                  decimals={decimals}
                  separator=","
                />
              ) : (
                0
              )}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedImpactMetric;