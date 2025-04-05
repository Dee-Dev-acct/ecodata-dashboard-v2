import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import AnimatedImpactMetric from './AnimatedImpactMetric';
import ImpactProgressTracker from './ImpactProgressTracker';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Droplets, Wind, Users, Building, Leaf, Target, Award, Trophy, Star, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface FundingGoal {
  id: string;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  milestones: {
    value: number;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[];
  icon: React.ReactNode;
  theme: 'default' | 'forest' | 'ocean' | 'sunset';
}

interface ImpactMetricData {
  id: number;
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ImpactDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  
  // Fetch impact metrics from API
  const { data: impactMetricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['/api/impact-metrics'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch funding goals/donation progress data
  // In a real app, this would come from an API endpoint
  const { data: fundingGoalsData, isLoading: isLoadingGoals } = useQuery({
    queryKey: ['/api/funding-goals'],
    queryFn: async () => {
      // If there's no actual API endpoint, we could fall back to this data
      // But in a real app, this would be fetched from the backend
      try {
        const response = await apiRequest("GET", "/api/funding-goals");
        if (!response.ok) {
          throw new Error("Failed to fetch funding goals");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching funding goals:", error);
        // Return default funding goals for demo purposes
        return defaultFundingGoals;
      }
    },
    staleTime: 60000, // 1 minute
  });
  
  // Map impact metrics data to component props
  const mapImpactMetrics = (data: any[]): ImpactMetricData[] => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'carbon': <Wind size={24} />,
      'water': <Droplets size={24} />,
      'trees': <TreePine size={24} />,
      'communities': <Users size={24} />,
      'partners': <Building size={24} />,
      'default': <Leaf size={24} />
    };
    
    const colorMap: { [key: string]: string } = {
      'carbon': 'blue',
      'water': 'teal',
      'trees': 'green',
      'communities': 'purple',
      'partners': 'amber',
      'default': 'emerald'
    };
    
    return data.map(metric => {
      // Determine icon and color based on title keywords
      let icon = iconMap.default;
      let color = colorMap.default;
      
      Object.keys(iconMap).forEach(keyword => {
        if (metric.title.toLowerCase().includes(keyword.toLowerCase())) {
          icon = iconMap[keyword];
          color = colorMap[keyword];
        }
      });
      
      return {
        id: metric.id,
        title: metric.title,
        value: metric.value,
        unit: metric.unit || '',
        description: metric.description,
        icon: icon,
        color: color
      };
    });
  };
  
  // Default funding goals
  const defaultFundingGoals: FundingGoal[] = [
    {
      id: 'reforestation',
      title: 'Reforestation Data Initiative',
      description: 'Help us fund data collection and analysis for reforestation projects',
      currentAmount: 3750,
      targetAmount: 10000,
      icon: <TreePine size={20} />,
      theme: 'forest',
      milestones: [
        {
          value: 2500,
          label: 'Monitoring Systems',
          icon: <Leaf size={16} />,
          description: 'Fund initial data collection sensors for forest monitoring'
        },
        {
          value: 5000,
          label: 'Halfway Mark',
          icon: <Target size={16} />,
          description: 'Enable expanded data analysis and visualization tools'
        },
        {
          value: 7500,
          label: 'Research Phase',
          icon: <Award size={16} />,
          description: 'Launch comprehensive environmental impact assessment studies'
        },
        {
          value: 10000,
          label: 'Full Funding',
          icon: <Trophy size={16} />,
          description: 'Complete implementation of the entire data-driven reforestation monitoring system'
        }
      ]
    },
    {
      id: 'water-quality',
      title: 'Water Quality Monitoring Network',
      description: 'Support our initiative to build a network of water quality sensors across key waterways',
      currentAmount: 8200,
      targetAmount: 15000,
      icon: <Droplets size={20} />,
      theme: 'ocean',
      milestones: [
        {
          value: 3000,
          label: 'Initial Sensors',
          icon: <Leaf size={16} />,
          description: 'Deploy the first batch of water quality monitoring sensors'
        },
        {
          value: 6000,
          label: 'Data Platform',
          icon: <Target size={16} />,
          description: 'Develop the data collection and analysis platform'
        },
        {
          value: 9000,
          label: 'Network Expansion',
          icon: <Award size={16} />,
          description: 'Expand the sensor network to additional waterways'
        },
        {
          value: 12000,
          label: 'Community Engagement',
          icon: <Users size={16} />,
          description: 'Launch community science program for participatory data collection'
        },
        {
          value: 15000,
          label: 'Full Coverage',
          icon: <Trophy size={16} />,
          description: 'Achieve full regional coverage and real-time monitoring capabilities'
        }
      ]
    },
    {
      id: 'community-impact',
      title: 'Community Impact Measurement',
      description: 'Fund our community-focused data collection and impact assessment projects',
      currentAmount: 4500,
      targetAmount: 8000,
      icon: <Users size={20} />,
      theme: 'sunset',
      milestones: [
        {
          value: 2000,
          label: 'Research Tools',
          icon: <Leaf size={16} />,
          description: 'Develop community impact assessment methodologies and tools'
        },
        {
          value: 4000,
          label: 'Data Collection',
          icon: <Target size={16} />,
          description: 'Implement initial community data collection projects'
        },
        {
          value: 6000,
          label: 'Analysis Framework',
          icon: <Award size={16} />,
          description: 'Build comprehensive analytics framework for social impact data'
        },
        {
          value: 8000,
          label: 'Full Implementation',
          icon: <Trophy size={16} />,
          description: 'Complete the community impact measurement system and dashboards'
        }
      ]
    }
  ];
  
  const handleDonateClick = (goal: FundingGoal) => {
    // Smooth scroll to donation form with pre-filled values
    const donationSection = document.getElementById('support');
    if (donationSection) {
      donationSection.scrollIntoView({ behavior: 'smooth' });
      // In a real app, we would pre-fill the donation form with the specific cause
    }
  };
  
  const mappedMetrics = impactMetricsData ? mapImpactMetrics(impactMetricsData as any[]) : [];
  const goals = fundingGoalsData || defaultFundingGoals;
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-4">Our Impact & Goals</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track our progress and see the real-world difference your support makes in our data-driven environmental initiatives.
          </p>
        </motion.div>
        
        <Tabs defaultValue="metrics" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="metrics">Impact Metrics</TabsTrigger>
            <TabsTrigger value="funding">Funding Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            {isLoadingMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-48">
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mappedMetrics.map((metric, index) => (
                  <AnimatedImpactMetric
                    key={metric.id}
                    title={metric.title}
                    value={metric.value}
                    unit={metric.unit}
                    description={metric.description}
                    icon={metric.icon}
                    color={metric.color}
                    delay={index * 0.2}
                  />
                ))}
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <Button onClick={() => setActiveTab('funding')} variant="outline" size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                View Funding Goals
              </Button>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="funding" className="space-y-8">
            {isLoadingGoals ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-64">
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full mt-2"></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {goals.map((goal: FundingGoal, index: number) => (
                  <ImpactProgressTracker
                    key={goal.id}
                    title={goal.title}
                    description={goal.description}
                    currentValue={goal.currentAmount}
                    targetValue={goal.targetAmount}
                    unit="£"
                    icon={goal.icon}
                    milestones={goal.milestones}
                    theme={goal.theme}
                    donateButtonText="Contribute to This Goal"
                    onDonateClick={() => handleDonateClick(goal)}
                  />
                ))}
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="py-8 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
            >
              <h3 className="text-xl font-bold mb-2">Join Us in Making a Difference</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Your contribution helps us reach these goals faster and expands our capacity to collect and analyze environmental data for positive impact.
              </p>
              <Button size="lg" onClick={() => {
                const donationSection = document.getElementById('support');
                if (donationSection) {
                  donationSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Support Our Mission
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ImpactDashboard;