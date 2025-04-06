import { useQuery } from "@tanstack/react-query";
import { ImpactMetric } from "@shared/schema";
import ImpactVisualization from "./ImpactVisualization";
import {
  CommunityEngagementHoursIcon,
  DigitalLiteracyIcon,
  DashboardsDeployedIcon,
  OpenDataIcon,
  PolicyRecommendationsIcon
} from "@/components/icons";

const ImpactCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md overflow-hidden">
      <div className="h-40 bg-primary/10 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold text-primary mb-2">{value}</p>
        <p className="dark:text-[#F4F1DE]">
          {description}
        </p>
      </div>
    </div>
  );
};

const Impact = () => {
  // We're using predefined alternative metrics instead of querying
  const alternativeMetrics = [
    {
      id: 1,
      title: "Community Engagement Hours",
      value: "3,420 hrs",
      description: "Total hours spent by community members in workshops, training, or volunteering",
      icon: <CommunityEngagementHoursIcon className="h-16 w-16 text-primary" />
    },
    {
      id: 2,
      title: "Digital Literacy",
      value: "248 trained",
      description: "Participants who improved their digital skills across three different levels",
      icon: <DigitalLiteracyIcon className="h-16 w-16 text-primary" />
    },
    {
      id: 3,
      title: "Decision Dashboards",
      value: "12",
      description: "Evidence-based dashboards deployed to support community decision-making",
      icon: <DashboardsDeployedIcon className="h-16 w-16 text-primary" />
    }
  ];

  return (
    <section id="impact" className="py-16 bg-white dark:bg-[#333333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-7 relative inline-block">
            <span>Impact</span>
            <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            Measuring our environmental and social contribution through data-driven metrics that showcase real-world change.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alternativeMetrics.map((metric) => (
            <ImpactCard 
              key={metric.id}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
            />
          ))}
        </div>
        
        {/* Interactive Data Visualization Section */}
        <div className="mt-20 bg-[#F4F1DE]/30 dark:bg-[#264653]/30 rounded-xl p-6 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4 relative inline-block">
              <span>Interactive Impact Analytics</span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#2A9D8F] opacity-40"></span>
            </h2>
            <p className="text-base max-w-3xl mx-auto dark:text-[#F4F1DE]/90">
              Explore our impact data through interactive visualizations. See the progress over time, 
              compare metrics, and understand how our work translates into real-world results.
            </p>
          </div>
          
          <ImpactVisualization />
        </div>
      </div>
    </section>
  );
};

export default Impact;
