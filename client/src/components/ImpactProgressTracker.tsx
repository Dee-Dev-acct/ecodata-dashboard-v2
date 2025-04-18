import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Star, ArrowRight, Award, Sparkles } from "lucide-react";
import CountUp from 'react-countup';

interface Milestone {
  value: number;
  label: string;
  icon: React.ReactNode;
  description?: string;
  achieved?: boolean;
}

interface ImpactProgressTrackerProps {
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon?: React.ReactNode;
  milestones?: Milestone[];
  donateButtonText?: string;
  theme?: 'default' | 'forest' | 'ocean' | 'sunset';
  onDonateClick?: () => void;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  daysRemaining?: number;
  location?: string;
  impact?: string;
  coverImage?: string;
  suggestedDonations?: number[];
}

const ImpactProgressTracker: React.FC<ImpactProgressTrackerProps> = ({
  title,
  description,
  currentValue,
  targetValue,
  unit,
  icon,
  milestones = [],
  donateButtonText = "Contribute",
  theme = 'default',
  onDonateClick,
  urgency,
  daysRemaining,
  location,
  impact,
  coverImage,
  suggestedDonations,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
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
  
  const controls = useAnimation();
  const progressControls = useAnimation();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressPercentage = Math.min(100, Math.round((currentValue / targetValue) * 100));
  
  // Define theme colors
  const themes = {
    default: {
      progressColor: 'bg-emerald-500',
      cardGradient: 'bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-900',
      milestoneColor: 'text-emerald-600 dark:text-emerald-400',
      progressBackground: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    forest: {
      progressColor: 'bg-green-600',
      cardGradient: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/60',
      milestoneColor: 'text-green-700 dark:text-green-400',
      progressBackground: 'bg-green-100 dark:bg-green-900/30'
    },
    ocean: {
      progressColor: 'bg-blue-500',
      cardGradient: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/60',
      milestoneColor: 'text-blue-600 dark:text-blue-400',
      progressBackground: 'bg-blue-100 dark:bg-blue-900/30'
    },
    sunset: {
      progressColor: 'bg-amber-500',
      cardGradient: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/60',
      milestoneColor: 'text-amber-600 dark:text-amber-400',
      progressBackground: 'bg-amber-100 dark:bg-amber-900/30'
    }
  };

  const currentTheme = themes[theme];
  
  // Sort milestones by value
  const sortedMilestones = [...milestones].sort((a, b) => a.value - b.value);
  
  // Find the next milestone
  const nextMilestone = sortedMilestones.find(milestone => milestone.value > currentValue);
  
  // Find the latest achieved milestone
  const latestAchievedMilestone = [...sortedMilestones]
    .filter(milestone => milestone.value <= currentValue)
    .pop();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
      });
      
      // Animate progress bar from 0 to current percentage
      setAnimatedProgress(0);
      const timer = setTimeout(() => {
        setAnimatedProgress(progressPercentage);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [inView, controls, progressPercentage]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="w-full"
    >
      <Card className={`overflow-hidden ${currentTheme.cardGradient} border shadow-md`}>
        {coverImage && (
          <div className="relative w-full h-32 overflow-hidden">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {location && (
              <div className="absolute bottom-2 left-2 text-white text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {location}
              </div>
            )}
          </div>
        )}
        
        <CardHeader className={coverImage ? 'pt-3' : ''}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {icon && <div className={currentTheme.milestoneColor}>{icon}</div>}
              <div>
                <CardTitle>{title}</CardTitle>
                {urgency && (
                  <div className="flex items-center mt-1">
                    {urgency === 'critical' && (
                      <Badge variant="destructive" className="text-xs">Urgent: {daysRemaining} days left</Badge>
                    )}
                    {urgency === 'high' && (
                      <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">High Priority: {daysRemaining} days left</Badge>
                    )}
                    {urgency === 'medium' && (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
                        {daysRemaining} days remaining
                      </Badge>
                    )}
                    {urgency === 'low' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {daysRemaining} days remaining
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className="font-normal">
              {progressPercentage}% Complete
            </Badge>
          </div>
          <CardDescription className="mt-2">{description}</CardDescription>
          {impact && (
            <div className="mt-2 text-sm flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-600 dark:text-gray-300">{impact}</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Current Progress</span>
              <span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {inView ? (
                    <CountUp
                      start={0}
                      end={currentValue}
                      duration={2}
                      separator=","
                    />
                  ) : (
                    currentValue
                  )}
                </span>
                <span> / {targetValue.toLocaleString()} {unit}</span>
              </span>
            </div>
            
            <div className="relative pt-1">
              <div className={`h-2 rounded-full ${currentTheme.progressBackground}`}>
                <motion.div 
                  className={`h-2 rounded-full ${currentTheme.progressColor}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${animatedProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Milestone markers */}
                {sortedMilestones.map((milestone, index) => {
                  const milestonePosition = (milestone.value / targetValue) * 100;
                  const isAchieved = currentValue >= milestone.value;
                  
                  return (
                    <div 
                      key={index}
                      className="absolute bottom-0 transform -translate-x-1/2"
                      style={{ 
                        left: `${milestonePosition}%`, 
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <motion.div 
                        className={`w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          isAchieved ? currentTheme.progressColor : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 + (index * 0.1), duration: 0.3 }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Milestone information */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            {latestAchievedMilestone && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 shadow-sm border"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className={`h-5 w-5 ${currentTheme.milestoneColor}`} />
                  <h3 className="font-medium">Latest Milestone Achieved!</h3>
                </div>
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full ${currentTheme.progressBackground} ${currentTheme.milestoneColor}`}>
                    {latestAchievedMilestone.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{latestAchievedMilestone.label}</p>
                    {latestAchievedMilestone.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{latestAchievedMilestone.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {nextMilestone && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.3 }}
                className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 shadow-sm border"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className={`h-5 w-5 ${currentTheme.milestoneColor}`} />
                  <h3 className="font-medium">Next Milestone</h3>
                </div>
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full ${currentTheme.progressBackground} text-gray-400 dark:text-gray-500`}>
                    {nextMilestone.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{nextMilestone.label}</p>
                      <Badge variant="outline" className="ml-2">
                        {nextMilestone.value.toLocaleString()} {unit}
                      </Badge>
                    </div>
                    {nextMilestone.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{nextMilestone.description}</p>
                    )}
                    
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {(nextMilestone.value - currentValue).toLocaleString()} {unit} more needed
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          {suggestedDonations && suggestedDonations.length > 0 && (
            <>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">
                Suggested donations:
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedDonations.map((amount, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full h-10 min-w-20"
                    onClick={() => onDonateClick?.()}
                  >
                    {unit}{amount}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full h-10"
                  onClick={() => onDonateClick?.()}
                >
                  Custom
                </Button>
              </div>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">or</span>
                </div>
              </div>
            </>
          )}
          
          <Button 
            onClick={onDonateClick} 
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {donateButtonText}
          </Button>
          
          {urgency === 'critical' && (
            <div className="text-xs text-red-500 dark:text-red-400 text-center mt-1 animate-pulse">
              Only {daysRemaining} days left to reach our goal!
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ImpactProgressTracker;