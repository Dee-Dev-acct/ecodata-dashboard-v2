import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart4,
  Calendar,
  CircleDollarSign,
  Clock,
  Edit,
  FilePieChart,
  FileText,
  Heart,
  LayoutDashboard,
  List,
  LogOut,
  Plus,
  Settings,
  User,
  Wallet,
  Bell,
  BellOff,
  AlertCircle,
  Key
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImpactProgressTracker from "@/components/ImpactProgressTracker";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Donations interface
interface Donation {
  id: number;
  amount: number;
  currency: string;
  email: string;
  name: string | null;
  fundingGoalId: string | null;
  status: string;
  isGiftAid: boolean;
  createdAt: string;
}

// Subscriptions interface
interface Subscription {
  id: number;
  amount: number;
  currency: string;
  email: string;
  name: string | null;
  interval: string;
  tier: string;
  status: string;
  isGiftAid: boolean;
  createdAt: string;
  currentPeriodEnd: string | null;
}

// Project Proposal interface
interface ProjectProposal {
  id: number;
  title: string;
  description: string;
  category: string;
  fundingNeeded: number | null;
  location: string | null;
  status: string;
  createdAt: string;
}

// Funding Goal interface
interface FundingGoal {
  id: string;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  daysRemaining?: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user donations
  const { data: donations, isLoading: isLoadingDonations } = useQuery({
    queryKey: ['/api/user/donations'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/donations");
      return await response.json();
    },
    enabled: !!user
  });

  // Fetch user subscriptions
  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['/api/user/subscriptions'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/subscriptions");
      return await response.json();
    },
    enabled: !!user
  });

  // Fetch user watchlist
  const { data: watchlist, isLoading: isLoadingWatchlist } = useQuery({
    queryKey: ['/api/user/watchlist'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/watchlist");
      return await response.json();
    },
    enabled: !!user
  });

  // Calculate total impact
  const totalDonated = donations?.reduce((sum: number, donation: Donation) => 
    donation.status === 'completed' ? sum + donation.amount : sum, 0) || 0;
  
  const totalMonthlySubscriptions = subscriptions?.reduce((sum: number, sub: Subscription) => 
    sub.status === 'active' && sub.interval === 'month' ? sum + sub.amount : sum, 0) || 0;

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  const formatCurrency = (amount: number, currency = 'gbp') => {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Example milestones for the impact tracker
  const impactMilestones = [
    { value: 0, label: "Starting Point", icon: <Plus size={16} />, description: "Begin your journey with us" },
    { value: 50, label: "Bronze Supporter", icon: <div className="w-4 h-4 flex items-center justify-center"><span className="block w-4 h-4 bg-bronze rounded-full" /></div>, description: "You're making a difference" },
    { value: 150, label: "Silver Advocate", icon: <Award size={16} />, description: "Your contributions are growing" },
    { value: 300, label: "Gold Champion", icon: <Crown size={16} />, description: "You're a key contributor" },
    { value: 500, label: "Platinum Hero", icon: <Star size={16} />, description: "Leading by example" },
    { value: 1000, label: "Environmental Guardian", icon: <Shield size={16} />, description: "Your impact is extraordinary" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Dashboard Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{user?.username}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member</p>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">DASHBOARD</h3>
              <div className="space-y-1">
                <Button 
                  variant={activeTab === "overview" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button 
                  variant={activeTab === "donations" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("donations")}
                >
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  Donations
                </Button>
                <Button 
                  variant={activeTab === "subscriptions" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("subscriptions")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Subscriptions
                </Button>
                <Button 
                  variant={activeTab === "watchlist" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("watchlist")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Watchlist
                </Button>
                <Button 
                  variant={activeTab === "impact" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("impact")}
                >
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Impact Tracker
                </Button>
              </div>
            </div>
            
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">ACCOUNT</h3>
              <div className="space-y-1">
                <Button 
                  variant={activeTab === "profile" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "secondary" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {/* Top Navigation (Mobile) */}
          <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-lg">Dashboard</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          
          {/* Mobile Navigation Tabs */}
          <div className="md:hidden border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-12 w-auto inline-flex p-1 pl-4 pr-4">
                <TabsTrigger value="overview" className="h-10">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="donations" className="h-10">
                  <CircleDollarSign className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only">Donations</span>
                </TabsTrigger>
                <TabsTrigger value="impact" className="h-10">
                  <BarChart4 className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only">Impact</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="h-10">
                  <User className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only">Profile</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Main Content */}
          <main className="p-4 md:p-8">
            {/* Dashboard Header */}
            <div className="hidden md:flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "donations" && "Your Donations"}
                {activeTab === "subscriptions" && "Your Subscriptions"}
                {activeTab === "watchlist" && "Your Watchlist"}
                {activeTab === "impact" && "Impact Tracker"}
                {activeTab === "profile" && "Your Profile"}
                {activeTab === "settings" && "Account Settings"}
              </h1>
              <div>
                <Button variant="outline" className="shadow-sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
            
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Donations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingDonations ? (
                          <Skeleton className="h-8 w-28" />
                        ) : (
                          formatCurrency(totalDonated)
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Across {donations?.length || 0} contributions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Monthly Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingSubscriptions ? (
                          <Skeleton className="h-8 w-28" />
                        ) : (
                          formatCurrency(totalMonthlySubscriptions)
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Active monthly subscriptions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Watchlist Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingWatchlist ? (
                          <Skeleton className="h-8 w-28" />
                        ) : (
                          watchlist?.length || 0
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Funding goals you're tracking
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Member Since
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatDate(user?.createdAt || new Date().toISOString())}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Thank you for your support!
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Activity and Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest donations and engagements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingDonations ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : donations?.length > 0 ? (
                        <div className="space-y-4">
                          {donations.slice(0, 5).map((donation: Donation) => (
                            <div key={donation.id} className="flex items-start gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                              <div className="bg-emerald-100 dark:bg-emerald-900 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <CircleDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">Donation</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(donation.createdAt)}</p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  You donated {formatCurrency(donation.amount, donation.currency)} 
                                  {donation.fundingGoalId && " to a funding goal"}
                                  {donation.isGiftAid && " with Gift Aid"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                            <CircleDollarSign className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-1">No donations yet</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                            Make your first donation to a funding goal to see your contribution here.
                          </p>
                          <Button>
                            <Heart className="mr-2 h-4 w-4" />
                            Explore Funding Goals
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    {donations?.length > 0 && (
                      <CardFooter className="border-t border-gray-100 dark:border-gray-800 px-6 py-4">
                        <Button variant="outline" className="w-full">
                          <List className="mr-2 h-4 w-4" />
                          View All Activity
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                  
                  {/* Impact Visualization */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Support Journey</CardTitle>
                      <CardDescription>Track your contribution progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ImpactProgressTracker
                        title="Your Support Level"
                        description="See how your contributions are making a difference"
                        currentValue={totalDonated}
                        targetValue={1000}
                        unit="£"
                        milestones={impactMilestones}
                        theme="forest"
                      />
                    </CardContent>
                    <CardFooter className="border-t border-gray-100 dark:border-gray-800 px-6 py-4">
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("impact")}>
                        <BarChart4 className="mr-2 h-4 w-4" />
                        View Full Impact Report
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Watchlist Preview */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Your Watchlist</CardTitle>
                        <CardDescription>Funding goals you're following</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("watchlist")}>
                        <Bell className="mr-2 h-4 w-4" />
                        Manage Watchlist
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingWatchlist ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : watchlist?.length > 0 ? (
                      <div className="space-y-4">
                        {watchlist.slice(0, 3).map((goal: FundingGoal) => (
                          <div key={goal.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">{goal.title}</h3>
                                {goal.urgency && (
                                  <Badge variant={
                                    goal.urgency === 'critical' ? 'destructive' :
                                    goal.urgency === 'high' ? 'destructive' :
                                    goal.urgency === 'medium' ? 'outline' : 'outline'
                                  }>
                                    {goal.urgency}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} raised
                              </p>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-emerald-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Your watchlist is empty</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                          Add funding goals to your watchlist to receive updates and track their progress.
                        </p>
                        <Button>
                          <BellPlus className="mr-2 h-4 w-4" />
                          Browse Funding Goals
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Donations Tab Content */}
            {activeTab === "donations" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Donations</CardTitle>
                    <CardDescription>A complete history of your contributions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDonations ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : donations?.length > 0 ? (
                      <div className="space-y-4">
                        {donations.map((donation: Donation) => (
                          <div key={donation.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="bg-emerald-100 dark:bg-emerald-900 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                              <CircleDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <h3 className="font-medium">
                                  {formatCurrency(donation.amount, donation.currency)}
                                  {donation.isGiftAid && (
                                    <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                      Gift Aid
                                    </Badge>
                                  )}
                                </h3>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                  {formatDate(donation.createdAt)}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {donation.fundingGoalId ? `Donated to funding goal` : `General donation`}
                              </p>
                              <div className="flex items-center mt-2">
                                <Badge variant={
                                  donation.status === 'completed' ? 'default' :
                                  donation.status === 'processing' ? 'outline' : 'secondary'
                                }>
                                  {donation.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <CircleDollarSign className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No donations yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                          Support our mission by making a donation to one of our funding goals.
                        </p>
                        <Button>
                          <Heart className="mr-2 h-4 w-4" />
                          Make a Donation
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Subscriptions Tab Content */}
            {activeTab === "subscriptions" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Subscriptions</CardTitle>
                    <CardDescription>Manage your recurring contributions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingSubscriptions ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : subscriptions?.length > 0 ? (
                      <div className="space-y-4">
                        {subscriptions.map((subscription: Subscription) => (
                          <div key={subscription.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-start gap-3">
                                <div className="bg-emerald-100 dark:bg-emerald-900 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                <div>
                                  <h3 className="font-medium flex items-center">
                                    {formatCurrency(subscription.amount, subscription.currency)} / {subscription.interval}
                                    {subscription.isGiftAid && (
                                      <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                        Gift Aid
                                      </Badge>
                                    )}
                                  </h3>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Started on {formatDate(subscription.createdAt)}
                                    {subscription.currentPeriodEnd && (
                                      <> · Next payment on {formatDate(subscription.currentPeriodEnd)}</>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 sm:mt-0">
                                <Badge variant={
                                  subscription.status === 'active' ? 'default' :
                                  subscription.status === 'canceled' ? 'destructive' : 'outline'
                                }>
                                  {subscription.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {subscription.status === 'active' && (
                              <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                                  <Clock className="mr-2 h-4 w-4" />
                                  Manage Subscription
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No active subscriptions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                          Set up a recurring contribution to provide ongoing support to our mission.
                        </p>
                        <Button>
                          <Calendar className="mr-2 h-4 w-4" />
                          Start a Subscription
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Watchlist Tab Content */}
            {activeTab === "watchlist" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Watchlist</CardTitle>
                    <CardDescription>Funding goals you're following</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingWatchlist ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : watchlist?.length > 0 ? (
                      <div className="space-y-4">
                        {watchlist.map((goal: FundingGoal) => (
                          <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{goal.title}</h3>
                              <div className="flex items-center gap-2">
                                {goal.urgency && (
                                  <Badge variant={
                                    goal.urgency === 'critical' ? 'destructive' :
                                    goal.urgency === 'high' ? 'destructive' :
                                    goal.urgency === 'medium' ? 'outline' : 'outline'
                                  }>
                                    {goal.urgency}
                                  </Badge>
                                )}
                                {goal.daysRemaining !== undefined && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {goal.daysRemaining} days left
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {goal.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-sm">
                                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} raised
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% funded
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                              <div 
                                className="bg-emerald-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                              />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button size="sm">
                                <Heart className="mr-2 h-3 w-3" />
                                Donate
                              </Button>
                              <Button variant="outline" size="sm">
                                <BellOff className="mr-2 h-3 w-3" />
                                Remove from Watchlist
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Your watchlist is empty</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                          Add funding goals to your watchlist to receive updates and track their progress.
                        </p>
                        <Button>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Browse Funding Goals
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Impact Tracker Tab Content */}
            {activeTab === "impact" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Impact Tracker</CardTitle>
                    <CardDescription>See the difference your support is making</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-8">
                      <ImpactProgressTracker
                        title="Your Support Journey"
                        description="Track how your contributions are helping our mission"
                        currentValue={totalDonated}
                        targetValue={1000}
                        unit="£"
                        milestones={impactMilestones}
                        theme="forest"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>View and edit your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-4xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" className="mt-4">
                          <Edit className="mr-2 h-4 w-4" />
                          Change Picture
                        </Button>
                      </div>
                      
                      <div className="md:w-2/3 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Username
                            </label>
                            <Input value={user?.username || ''} readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <Input value={user?.email || ''} readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              First Name
                            </label>
                            <Input value={user?.firstName || ''} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Last Name
                            </label>
                            <Input value={user?.lastName || ''} />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                          </label>
                          <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm"
                            rows={4}
                            placeholder="Tell us about yourself"
                            value={user?.bio || ''}
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Update Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Settings Tab Content */}
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Watchlist Alerts</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Receive updates when funding goals in your watchlist are close to deadline
                            </p>
                          </div>
                          <Switch checked={user?.notificationsEnabled} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Donation Receipts</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Receive email receipts for your donations and subscriptions
                            </p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Newsletter</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Receive our monthly newsletter with updates and impact stories
                            </p>
                          </div>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Security</h3>
                      <div className="space-y-4">
                        <Button variant="outline">
                          <Key className="mr-2 h-4 w-4" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/50">
                          <h4 className="font-medium text-red-700 dark:text-red-400">Delete Account</h4>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1 mb-3">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper components
function Award(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function BellPlus(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M19.3 14.8C20.1 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 1 0 1.9.2 2.8.7" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <path d="M15 8h6" />
      <path d="M18 5v6" />
    </svg>
  );
}

function Crown(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function Shield(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function Star(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}