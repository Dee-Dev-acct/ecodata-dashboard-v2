import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";

const ServiceCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  return (
    <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-5px]">
      <div className="w-14 h-14 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
        <i className={`fas ${icon} text-2xl text-[#2A9D8F]`}></i>
      </div>
      <h3 className="text-xl font-heading font-semibold mb-3">{title}</h3>
      <p className="dark:text-[#F4F1DE]">
        {description}
      </p>
    </div>
  );
};

const Services = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  return (
    <section id="services" className="py-16 bg-white dark:bg-[#333333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-7 relative inline-block">
            <span>Our Services</span>
            <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            We offer a comprehensive range of data-focused services to help organizations make informed decisions with positive environmental and social impact.
          </p>
        </div>
        
        {/* Services Grid */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A9D8F]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load services. Please try again later.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {services?.map((service) => (
              <ServiceCard 
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
