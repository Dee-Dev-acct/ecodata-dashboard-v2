import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  TreePine, Droplets, Wind, Users, Building, Leaf, Target, Award, Trophy, Star, Sparkles,
  SlidersHorizontal, AlertCircle, Bell, BellOff, BookmarkPlus, CircleCheck, Filter, ArrowUpDown
} from 'lucide-react';
import ImpactProgressTracker from '../components/ImpactProgressTracker';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";

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
  // State for filtering and sorting 
  const [filterByUrgency, setFilterByUrgency] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("urgency");
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    // Get watchlist from localStorage if available
    const saved = localStorage.getItem('fundingGoalsWatchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

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

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fundingGoalsWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleDonateClick = (goal: FundingGoal) => {
    // Scroll to support section for donation
    const supportSection = document.getElementById('support');
    if (supportSection) {
      supportSection.scrollIntoView({ behavior: 'smooth' });
      // In a production app, this would pre-select the appropriate donation purpose/amount
    }
  };

  const toggleWatchlist = (goalId: string) => {
    if (watchlist.includes(goalId)) {
      setWatchlist(watchlist.filter(id => id !== goalId));
      toast({
        title: "Removed from watchlist",
        description: "Project removed from your notifications list.",
        variant: "default",
      });
    } else {
      setWatchlist([...watchlist, goalId]);
      toast({
        title: "Added to watchlist",
        description: "You'll receive reminders about this project's deadline.",
        variant: "default",
      });
    }
  };

  const isWatched = (goalId: string) => watchlist.includes(goalId);

  // Process and filter the goals
  const processedGoals = fundingGoalsData ? processGoals(fundingGoalsData) : [];
  
  // Apply filters and sorting
  const filteredGoals = processedGoals.filter(goal => {
    // Apply urgency filter if not set to "all"
    if (filterByUrgency !== "all" && goal.urgency !== filterByUrgency) {
      return false;
    }
    
    // Filter by watchlist if it's enabled
    if (showWatchlist && !watchlist.includes(goal.id)) {
      return false;
    }
    
    // Filter by active tab (could be categories like "water", "forest", etc.)
    if (activeTab !== "all" && !goal.id.includes(activeTab)) {
      return false;
    }
    
    return true;
  });
  
  // Sort the filtered goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3, undefined: 4 };
    
    if (sortBy === "urgency") {
      return (urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 4) - 
             (urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 4);
    } else if (sortBy === "progress") {
      const progressA = (a.currentAmount / a.targetAmount) * 100;
      const progressB = (b.currentAmount / b.targetAmount) * 100;
      return progressB - progressA; // Highest progress first
    } else if (sortBy === "amount") {
      return b.targetAmount - a.targetAmount; // Highest amount first
    } else {
      return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold mb-4">Our Funding Goals</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join us in supporting critical environmental data initiatives. Your contribution directly 
          helps advance our mission through these targeted funding campaigns.
        </p>
      </motion.div>
      
      {/* Filter and sorting controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" /> 
              Filter by:
            </h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="reforestation">
                  <TreePine className="h-4 w-4 mr-1" /> Forest
                </TabsTrigger>
                <TabsTrigger value="water">
                  <Droplets className="h-4 w-4 mr-1" /> Water
                </TabsTrigger>
                <TabsTrigger value="community">
                  <Users className="h-4 w-4 mr-1" /> Community
                </TabsTrigger>
                <TabsTrigger value="carbon">
                  <Wind className="h-4 w-4 mr-1" /> Carbon
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
            
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="watchlist-toggle" 
                checked={showWatchlist}
                onCheckedChange={setShowWatchlist}
              />
              <Label htmlFor="watchlist-toggle" className="flex items-center whitespace-nowrap">
                <Bell className="h-4 w-4 mr-1" /> My Watchlist
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgency">Urgency</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="amount">Target Amount</SelectItem>
                </SelectContent>
              </Select>
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="mb-2 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Urgency:
          </p>
          <ToggleGroup type="single" value={filterByUrgency} onValueChange={(value) => setFilterByUrgency(value || "all")}>
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="critical" className="text-red-500">Critical</ToggleGroupItem>
            <ToggleGroupItem value="high" className="text-orange-500">High</ToggleGroupItem>
            <ToggleGroupItem value="medium" className="text-yellow-600">Medium</ToggleGroupItem>
            <ToggleGroupItem value="low" className="text-green-600">Low</ToggleGroupItem>
          </ToggleGroup>
        </div>
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
        <>
          {/* Display counts of filtered items */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {sortedGoals.length} of {processedGoals.length} funding goals
              {filterByUrgency !== "all" && (
                <span> — filtered by <Badge variant="outline" className="ml-1 font-normal">{filterByUrgency} urgency</Badge></span>
              )}
              {showWatchlist && watchlist.length > 0 && (
                <span> — from your <Badge variant="outline" className="ml-1 font-normal">watchlist</Badge></span>
              )}
              {activeTab !== "all" && (
                <span> — in category <Badge variant="outline" className="ml-1 font-normal">{activeTab}</Badge></span>
              )}
            </div>
            
            {sortedGoals.length === 0 && (
              <div className="w-full mt-4 p-8 text-center border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="text-gray-500 dark:text-gray-400 mb-2">No funding goals match your filters</div>
                <Button variant="outline" size="sm" onClick={() => {
                  setFilterByUrgency("all");
                  setActiveTab("all");
                  setShowWatchlist(false);
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          {/* Circular progress visualisation for goals requiring immediate attention */}
          {filterByUrgency === "all" && !showWatchlist && activeTab === "all" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium mb-4">Critical Needs at a Glance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {processedGoals
                  .filter(goal => goal.urgency === 'critical' || goal.urgency === 'high')
                  .slice(0, 4)
                  .map((goal, idx) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const remaining = 100 - progress;
                    const strokeDasharray = `${progress} ${remaining}`;
                    
                    return (
                      <div key={idx} className="relative">
                        <Card className="p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => {
                                const element = document.getElementById(goal.id);
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                              }}>
                          <div className="relative w-20 h-20 mb-2">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              {/* Background circle */}
                              <circle 
                                cx="18" cy="18" r="15.91549430918954" 
                                fill="transparent" 
                                stroke="#e9ecef" 
                                strokeWidth="2.5"
                              />
                              {/* Progress arc */}
                              <circle 
                                cx="18" cy="18" r="15.91549430918954" 
                                fill="transparent" 
                                stroke={goal.urgency === 'critical' ? '#ef4444' : '#f59e0b'}
                                strokeWidth="2.5"
                                strokeDasharray={strokeDasharray} 
                                strokeDashoffset="25"
                                className="transition-all duration-1000 ease-out" 
                              />
                              {/* Add days remaining count in the center */}
                              <text x="18" y="17" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">
                                {goal.daysRemaining}
                              </text>
                              <text x="18" y="23" textAnchor="middle" fontSize="3.5" fill="currentColor">
                                days left
                              </text>
                            </svg>
                            <div className="absolute top-0 right-0 -mt-2 -mr-2">
                              {goal.urgency === 'critical' ? (
                                <span className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                                  <AlertCircle className="h-3 w-3" />
                                </span>
                              ) : (
                                <span className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                  <AlertCircle className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-center line-clamp-1">{goal.title}</p>
                          <p className="text-xs text-gray-500 text-center">{Math.round(progress)}% funded</p>
                        </Card>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* Main goal cards */}
          <div className="space-y-10">
            {sortedGoals.map((goal: FundingGoal, index: number) => (
              <motion.div 
                id={goal.id}
                key={goal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Watchlist toggle button */}
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 ${
                      isWatched(goal.id) ? 'text-yellow-500 border-yellow-500' : 'text-gray-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(goal.id);
                    }}
                  >
                    {isWatched(goal.id) ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </Button>
                </div>
                
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
          
          {/* Empty state for watchlist */}
          {showWatchlist && watchlist.length === 0 && (
            <div className="w-full p-12 text-center border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                Add funding goals to your watchlist to get reminders about their deadlines and track their progress.
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowWatchlist(false)}>
                Browse All Goals
              </Button>
            </div>
          )}
        </>
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
                Enables sophisticated data analysis, visualisation tools, and research to extract meaningful insights.
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