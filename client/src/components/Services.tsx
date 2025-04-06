import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import React, { useMemo } from "react";
import { Link } from "wouter";

const ServiceCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  // Define links for each service
  const serviceLinks: Record<string, { href: string; linkText: string }> = {
    "Data Analytics": { 
      href: "/services/data-analytics", 
      linkText: "Learn more about our data analytics" 
    },
    "Environmental Research": { 
      href: "/services/environmental-research", 
      linkText: "Explore our environmental research" 
    },
    "Digital Literacy & Tech Training": { 
      href: "/services/digital-literacy", 
      linkText: "Discover our digital literacy programs" 
    },
    "Community Innovation & Social Impact Projects": { 
      href: "/services/social-impact", 
      linkText: "See our community impact projects" 
    },
    "IT Consultancy": { 
      href: "/services/it-consultancy", 
      linkText: "Explore our IT consulting services" 
    },
    "Web Development": { 
      href: "/services/web-development", 
      linkText: "View our web development approach" 
    }
  };
  
  // Check if this service has a detail page
  const serviceLink = serviceLinks[title];
  
  return (
    <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-5px]">
      <div className="w-14 h-14 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
        <i className={`fas ${icon} text-2xl text-[#2A9D8F]`}></i>
      </div>
      <h3 className="text-xl font-heading font-semibold mb-3">{title}</h3>
      <p className="dark:text-[#F4F1DE] mb-4">
        {description}
      </p>
      
      {serviceLink && (
        <Link href={serviceLink.href} className="inline-flex items-center text-[#2A9D8F] hover:text-[#38B593] font-medium">
          {serviceLink.linkText}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      )}
    </div>
  );
};

const Services = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Function to prioritize CIC-focused services
  const prioritizedServices = useMemo(() => {
    if (!services) return [];
    
    // Make a copy of the services array
    const sortedServices = [...services];
    
    // Sort services to prioritize CIC-focused ones
    return sortedServices.sort((a, b) => {
      // These are our CIC priority services
      const cicPriorityTitles = [
        "Digital Literacy & Tech Training",
        "Community Innovation & Social Impact Projects"
      ];
      
      const aIsCICService = cicPriorityTitles.includes(a.title);
      const bIsCICService = cicPriorityTitles.includes(b.title);
      
      if (aIsCICService && !bIsCICService) return -1; // a comes first
      if (!aIsCICService && bIsCICService) return 1;  // b comes first
      return 0; // keep original order for non-CIC services
    });
  }, [services]);

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
            {prioritizedServices.map((service) => (
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
