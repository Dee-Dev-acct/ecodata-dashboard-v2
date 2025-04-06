import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Leaf, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { QuickFeedbackButton } from '@/components/FeedbackDialog';
import SustainableDevelopmentGoals from '@/components/SustainableDevelopmentGoals';
import { 
  CarbonReductionIcon,
  CommunityEngagementIcon,
  ResourceEfficiencyIcon,
  CommunityEngagementHoursIcon,
  DigitalLiteracyIcon,
  DashboardsDeployedIcon,
  OpenDataIcon,
  PolicyRecommendationsIcon,
  EnvironmentalMonitoringIcon,
  TechAccessIcon,
  SatisfactionScoreIcon
} from '@/components/icons';
import {
  AnimatedCounter,
  BarChart,
  CounterWithTiles,
  DonutChart,
  GitHubActivity,
  HorizontalBars,
  MapWithHeatmap,
  SatisfactionGauge
} from '@/components/metrics';
import { 
  ImpactProject, 
  ImpactTimelineEvent,
  ImpactMetric 
} from '@shared/schema';

const mapIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Animation variants for framer-motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Metric counter animation component
const CounterAnimation = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  // Handle numbers with % or + at the end
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  const suffix = value.replace(/[0-9.-]/g, '');
  
  const [count, setCount] = useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = numericValue;
    const totalDuration = duration * 1000; // convert to milliseconds
    const incrementTime = totalDuration / end;
    
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
  }, [numericValue, duration]);
  
  return <>{count}{suffix}</>;
};

const TimelineEvent = ({ event }: { event: ImpactTimelineEvent }) => {
  return (
    <motion.div 
      className="flex mb-8 relative" 
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white z-10">
        {new Date(event.date).getFullYear()}
      </div>
      <div className="ml-6 bg-card border p-4 rounded-lg shadow-sm relative flex-grow">
        <h4 className="text-lg font-semibold mb-1">{event.title}</h4>
        <p className="text-muted-foreground text-sm mb-3">{new Date(event.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        <p>{event.description}</p>
        {event.imageUrl && (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="mt-3 rounded-md w-full max-h-48 object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

const ImpactPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [location] = useLocation();
  const [backLink, setBackLink] = useState({ path: "/#services", text: "Back to Services" });
  
  // Determine where the user came from
  useEffect(() => {
    // Check for referrer in sessionStorage
    const referrer = sessionStorage.getItem('referrer');
    
    if (referrer === 'footer') {
      setBackLink({ path: "/", text: "Back to Home" });
    }
    // Add more conditions as needed
    
    // Clean up
    return () => {
      sessionStorage.removeItem('referrer');
    };
  }, []);
  
  // Fetch impact metrics
  const { 
    data: metrics, 
    isLoading: metricsLoading 
  } = useQuery<ImpactMetric[]>({ 
    queryKey: ['/api/impact-metrics'],
  });

  // Fetch impact projects
  const { 
    data: projects, 
    isLoading: projectsLoading 
  } = useQuery<ImpactProject[]>({ 
    queryKey: ['/api/impact-projects'],
  });

  // Fetch timeline events for selected project or all events if no project selected
  const { 
    data: timelineEvents, 
    isLoading: eventsLoading 
  } = useQuery<ImpactTimelineEvent[]>({ 
    queryKey: ['/api/impact-timeline-events', selectedProject],
    enabled: !projectsLoading, // Only fetch events after projects are loaded
  });

  // Filter projects by category if selected
  const filteredProjects = selectedCategory 
    ? projects?.filter(project => project.category === selectedCategory)
    : projects;

  // Filter metrics by category if selected
  const filteredMetrics = selectedCategory 
    ? metrics?.filter(metric => metric.category === selectedCategory)
    : metrics;

  // Extract unique categories from projects for the filter
  const categories = React.useMemo(() => {
    if (!projects) return [];
    const categorySet = new Set<string>();
    projects.forEach(project => categorySet.add(project.category));
    return Array.from(categorySet);
  }, [projects]);

  const isLoading = metricsLoading || projectsLoading || eventsLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back navigation */}
      <div className="mb-8">
        <Link href={backLink.path} className="inline-flex items-center text-[#2A9D8F] hover:text-[#38B593]">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {backLink.text}
        </Link>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how ECODATA CIC is driving positive change through data-driven projects and initiatives. Our work spans environmental monitoring, social impact, and technological innovation.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="mb-12 flex justify-center flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Alternative Impact Metrics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeIn}>
              <AnimatedCounter 
                value={3420}
                title="Community Engagement Hours"
                description="Total hours spent in workshops and training"
                icon={<CommunityEngagementHoursIcon className="h-10 w-10" />}
                suffix=" hrs"
              />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <AnimatedCounter 
                value={248}
                title="Digital Literacy"
                description="Participants with improved digital skills"
                icon={<DigitalLiteracyIcon className="h-10 w-10" />}
                suffix=" trained"
              />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <AnimatedCounter 
                value={12}
                title="Decision Dashboards"
                description="Evidence-based dashboards deployed"
                icon={<DashboardsDeployedIcon className="h-10 w-10" />}
                prefix=""
              />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <AnimatedCounter 
                value={19}
                title="Open Data Contributions"
                description="Datasets contributed to public domain"
                icon={<OpenDataIcon className="h-10 w-10" />}
                prefix=""
              />
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <AnimatedCounter 
                value={5}
                title="Policy Recommendations"
                description="Policy briefs delivered to local government"
                icon={<PolicyRecommendationsIcon className="h-10 w-10" />}
                prefix=""
              />
            </motion.div>
          </motion.div>

          {/* Projects Map */}
          {filteredProjects && filteredProjects.length > 0 && (
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Impact Projects Map</h2>
              <div className="h-[500px] rounded-xl overflow-hidden shadow-md border">
                <MapContainer 
                  center={[54.5, -2]} // Center on UK
                  zoom={6} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredProjects.map(project => (
                    <Marker 
                      key={project.id}
                      position={[parseFloat(project.latitude.toString()), parseFloat(project.longitude.toString())]}
                      icon={mapIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedProject(project.id);
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-bold text-base">{project.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{project.location}</p>
                          <p className="text-sm">{project.description.substring(0, 100)}...</p>
                          <div className="mt-2">
                            <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                              {project.status}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </motion.div>
          )}

          {/* Featured Projects */}
          {filteredProjects && filteredProjects.length > 0 && (
            <motion.div 
              className="mb-16"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects
                  .filter(project => project.featured)
                  .map(project => (
                    <motion.div 
                      key={project.id}
                      className="bg-card rounded-xl overflow-hidden shadow-sm border"
                      variants={fadeIn}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      {project.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mb-2">
                              {project.category}
                            </span>
                            <h3 className="font-bold text-xl">{project.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{project.location}</p>
                        <p className="mb-4 line-clamp-3">{project.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Started: {new Date(project.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project.id);
                            }}
                            className="text-primary hover:underline font-medium"
                          >
                            View Timeline
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Data Visualisation Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Impact Visualisation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Community Engagement Hours - Bar Chart */}
              <BarChart 
                data={[
                  { name: 'Q1 2024', value: 950 },
                  { name: 'Q2 2024', value: 1200 },
                  { name: 'Q3 2024', value: 750 },
                  { name: 'Q4 2024', value: 700 }
                ]}
                title="Community Engagement Hours"
                subtitle="Total hours spent by community members in workshops, training, or volunteering"
                valueSuffix=" hrs"
              />
              
              {/* Digital Literacy Improvements - Donut Chart */}
              <DonutChart 
                data={[
                  { name: 'Beginners', value: 98, color: '#4BB462' },
                  { name: 'Intermediate', value: 87, color: '#2A9D8F' },
                  { name: 'Advanced', value: 63, color: '#264653' }
                ]}
                title="Digital Literacy Improvements"
                subtitle="248 participants improved digital skills across three levels"
                centerLabel="248"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* GitHub Activity */}
              <GitHubActivity 
                title="Open Source Contributions"
                subtitle="Recent code contributions to sustainability projects"
                contributions={[
                  { day: 'Mon', count: 5 },
                  { day: 'Tue', count: 8 },
                  { day: 'Wed', count: 12 },
                  { day: 'Thu', count: 4 },
                  { day: 'Fri', count: 9 },
                  { day: 'Sat', count: 3 },
                  { day: 'Sun', count: 0 }
                ]}
              />
              
              {/* Satisfaction Score - Horizontal Bars */}
              <HorizontalBars 
                data={[
                  { label: 'Very Satisfied', value: 78, color: '#4BB462' },
                  { label: 'Satisfied', value: 18, color: '#2A9D8F' },
                  { label: 'Neutral', value: 3, color: '#E9C46A' },
                  { label: 'Unsatisfied', value: 1, color: '#E76F51' }
                ]}
                title="Satisfaction Score"
                subtitle="Based on partner/participant feedback via surveys"
                maxValue={100}
              />
            </div>
            
            <div className="flex justify-center">
              {/* Counter with Tiles */}
              <CounterWithTiles
                title="Community Impact"
                subtitle="Different ways we're making a difference"
                tiles={[
                  { label: 'Organisations', value: 24, icon: "🏢" },
                  { label: 'Schools', value: 17, icon: "🏫" },
                  { label: 'Communities', value: 31, icon: "🏘️" },
                  { label: 'Regions', value: 8, icon: "🗺️" }
                ]}
                className="max-w-3xl"
              />
            </div>
          </motion.div>

          {/* Project Timeline */}
          {selectedProject && timelineEvents && timelineEvents.length > 0 && (
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Project Timeline</h2>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-sm text-primary hover:underline"
                >
                  View All Projects
                </button>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/30 ml-0.5" />
                
                {/* Timeline events */}
                <div className="space-y-0">
                  {timelineEvents.map(event => (
                    <TimelineEvent key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Sustainable Development Goals */}
          {!selectedProject && (
            <SustainableDevelopmentGoals />
          )}
        </>
      )}
      
      <div className="flex justify-center mt-12">
        <QuickFeedbackButton />
      </div>
    </div>
  );
};

export default ImpactPage;