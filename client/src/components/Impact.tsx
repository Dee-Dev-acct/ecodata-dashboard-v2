import { useQuery } from "@tanstack/react-query";
import { ImpactMetric } from "@shared/schema";
import ImpactVisualization from "./ImpactVisualization";

const ImpactCard = ({ title, value, description, icon, category }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: string;
  category: string;
}) => {
  // Determine color class based on category
  const colorClass = () => {
    switch (category) {
      case 'environmental':
        return 'bg-[#2A9D8F] text-[#2A9D8F]';
      case 'social':
        return 'bg-[#457B9D] text-[#457B9D]';
      case 'efficiency':
        return 'bg-[#4CAF50] text-[#4CAF50]';
      default:
        return 'bg-[#2A9D8F] text-[#2A9D8F]';
    }
  };

  return (
    <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md overflow-hidden">
      <div className={`h-40 ${colorClass()} bg-opacity-10 flex items-center justify-center`}>
        <div className="w-full h-full flex items-center justify-center">
          <i className={`fas ${icon} text-6xl ${colorClass()}`}></i>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass()} mb-2`}>{value}</p>
        <p className="dark:text-[#F4F1DE]">
          {description}
        </p>
      </div>
    </div>
  );
};

const Impact = () => {
  const { data: metrics, isLoading, error } = useQuery<ImpactMetric[]>({
    queryKey: ['/api/impact-metrics'],
  });

  return (
    <section id="impact" className="py-16 bg-white dark:bg-[#333333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-7 relative inline-block">
            <span>Our Impact</span>
            <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            Measuring our environmental and social contribution through data-driven metrics that showcase real-world change.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A9D8F]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load impact metrics. Please try again later.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics?.map((metric) => (
              <ImpactCard 
                key={metric.id}
                title={metric.title}
                value={metric.value}
                description={metric.description}
                icon={metric.icon}
                category={metric.category}
              />
            ))}
          </div>
        )}
        
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
        
        {/* SDG Goals Section */}
        <div className="mt-16">
          <h3 className="text-xl font-heading font-semibold mb-6 text-center">Supporting UN Sustainable Development Goals</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="h-20 w-20 bg-[#E5243B] rounded-md shadow-sm flex items-center justify-center text-white font-bold">
              SDG 11
            </div>
            <div className="h-20 w-20 bg-[#DDA63A] rounded-md shadow-sm flex items-center justify-center text-white font-bold">
              SDG 12
            </div>
            <div className="h-20 w-20 bg-[#4C9F38] rounded-md shadow-sm flex items-center justify-center text-white font-bold">
              SDG 13
            </div>
            <div className="h-20 w-20 bg-[#19486A] rounded-md shadow-sm flex items-center justify-center text-white font-bold">
              SDG 17
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
