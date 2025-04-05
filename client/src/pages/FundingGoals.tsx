import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TreePine, Droplets, Wind, Users, Building, Leaf, Target, Award, Trophy, Star, Sparkles } from 'lucide-react';
import ImpactProgressTracker from '../components/ImpactProgressTracker';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  daysRemaining?: number;
  location?: string;
  impact?: string;
  coverImage?: string;
  suggestedDonations?: number[];
  iconName?: string;
  featured?: boolean;
}

const FundingGoals: React.FC = () => {
  // Fetch funding goals data
  const { data: fundingGoalsData, isLoading } = useQuery({
    queryKey: ['/api/funding-goals'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/funding-goals");
        if (!response.ok) {
          throw new Error("Failed to fetch funding goals");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching funding goals:", error);
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
  });

  // Process icons for each goal
  const processGoals = (goals: any[]): FundingGoal[] => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'reforestation': <TreePine size={20} />,
      'water': <Droplets size={20} />,
      'community': <Users size={20} />,
      'research': <Target size={20} />,
      'carbon': <Wind size={20} />,
      'default': <Leaf size={20} />
    };

    const milestoneIconMap: { [key: string]: React.ReactNode } = {
      'initial': <Leaf size={16} />,
      'halfway': <Target size={16} />,
      'research': <Award size={16} />,
      'complete': <Trophy size={16} />,
      'community': <Users size={16} />,
      'default': <Star size={16} />
    };

    return goals.map(goal => {
      // Determine icon based on id or title
      let icon = iconMap.default;
      
      Object.keys(iconMap).forEach(key => {
        if (goal.id.toLowerCase().includes(key) || goal.title.toLowerCase().includes(key)) {
          icon = iconMap[key];
        }
      });

      // Process milestones to add icons if they don't have them
      const processedMilestones = goal.milestones.map((milestone: any) => {
        if (milestone.icon) return milestone;
        
        // Find appropriate icon based on label
        let milestoneIcon = milestoneIconMap.default;
        Object.keys(milestoneIconMap).forEach(key => {
          if (milestone.label.toLowerCase().includes(key)) {
            milestoneIcon = milestoneIconMap[key];
          }
        });
        
        return {
          ...milestone,
          icon: milestoneIcon
        };
      });

      // Create a properly typed object with all expected properties
      const processedGoal: FundingGoal = {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
        icon: goal.icon || icon,
        milestones: processedMilestones,
        theme: goal.theme || 'default',
        urgency: goal.urgency,
        daysRemaining: goal.daysRemaining,
        location: goal.location,
        impact: goal.impact,
        coverImage: goal.coverImage,
        suggestedDonations: goal.suggestedDonations,
        iconName: goal.iconName,
        featured: goal.featured
      };
      
      return processedGoal;
    });
  };

  const handleDonateClick = (goal: FundingGoal) => {
    // Scroll to support section for donation
    const supportSection = document.getElementById('support');
    if (supportSection) {
      supportSection.scrollIntoView({ behavior: 'smooth' });
      // In a production app, this would pre-select the appropriate donation purpose/amount
    }
  };

  const processedGoals = fundingGoalsData ? processGoals(fundingGoalsData) : [];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Our Funding Goals</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join us in supporting critical environmental data initiatives. Your contribution directly 
          helps advance our mission through these targeted funding campaigns.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-64 animate-pulse">
              <CardHeader>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full my-2"></div>
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded w-full mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {processedGoals.map((goal: FundingGoal, index: number) => (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ImpactProgressTracker
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
                urgency={goal.urgency}
                daysRemaining={goal.daysRemaining}
                location={goal.location}
                impact={goal.impact}
                coverImage={goal.coverImage}
                suggestedDonations={goal.suggestedDonations || [25, 50, 100, 250]}
              />
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">How Your Contributions Make a Difference</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Every donation helps drive our data-driven environmental initiatives forward. Here's how your support translates into real impact:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                  <TreePine size={20} />
                </div>
                <CardTitle className="text-lg">Data Collection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Funds advanced monitoring systems and sensors for precise environmental data collection in the field.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                  <Target size={20} />
                </div>
                <CardTitle className="text-lg">Analysis & Research</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Enables sophisticated data analysis, visualization tools, and research to extract meaningful insights.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400">
                  <Users size={20} />
                </div>
                <CardTitle className="text-lg">Community Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Supports community engagement programs and the development of frameworks to measure social impact.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col items-center">
          <p className="text-xl font-medium mb-6">
            Ready to make an impact? Join our community of supporters today.
          </p>
          <Button size="lg" onClick={() => {
            const supportSection = document.getElementById('support');
            if (supportSection) {
              supportSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            <Sparkles className="mr-2 h-4 w-4" />
            Support Our Work
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FundingGoals;