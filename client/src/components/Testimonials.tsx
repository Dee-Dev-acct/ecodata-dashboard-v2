import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  imageUrl: string | null | undefined;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ 
  name, 
  position, 
  company, 
  testimonial, 
  rating, 
  imageUrl 
}) => {
  return (
    <motion.div 
      className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-8 relative overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Quote className="text-[#2A9D8F] absolute opacity-10 h-24 w-24 top-6 right-6" />
      <div className="flex items-center mb-6 relative z-10">
        <img 
          src={imageUrl || "https://randomuser.me/api/portraits/lego/1.jpg"} 
          alt={`${name} - ${position} at ${company}`} 
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#2A9D8F]"
        />
        <div>
          <h4 className="font-medium text-lg">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-[#F4F1DE]/80">{position}, {company}</p>
        </div>
      </div>
      <div className="mb-4 text-yellow-400 relative z-10">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fas ${i < rating ? 'fa-star' : i + 0.5 === rating ? 'fa-star-half-alt' : 'fa-star text-gray-300'}`}
          ></i>
        ))}
      </div>
      <p className="italic dark:text-[#F4F1DE] text-lg leading-relaxed flex-grow relative z-10">
        "{testimonial}"
      </p>
    </motion.div>
  );
};

const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonialsPerPage, setTestimonialsPerPage] = useState(3);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) {
        setTestimonialsPerPage(1);
      } else if (width < 1024) {
        setTestimonialsPerPage(2);
      } else {
        setTestimonialsPerPage(3);
      }
    };
    
    // Run on mount
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Auto scroll testimonials with pause on hover
  useEffect(() => {
    if (!testimonials || testimonials.length <= testimonialsPerPage) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => 
        (prev + 1) % (testimonials.length - testimonialsPerPage + 1)
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials, testimonialsPerPage]);
  
  const nextTestimonial = () => {
    if (!testimonials) return;
    setCurrentTestimonialIndex((prev) => 
      (prev + 1) % (testimonials.length - testimonialsPerPage + 1)
    );
  };
  
  const prevTestimonial = () => {
    if (!testimonials) return;
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - testimonialsPerPage : prev - 1
    );
  };
  
  const displayedTestimonials = testimonials?.slice(
    currentTestimonialIndex, 
    currentTestimonialIndex + testimonialsPerPage
  );

  return (
    <section className="py-16 bg-white dark:bg-[#333333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-7 relative inline-block">
            <span>Client Testimonials</span>
            <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            Hear from our partners about the impact of our data-driven solutions.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A9D8F]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load testimonials. Please try again later.
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="relative">
            <div className="mb-8 relative h-[320px] md:h-[300px]">
              <AnimatePresence mode="wait">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute w-full">
                  {displayedTestimonials?.map((testimonial) => (
                    <TestimonialCard 
                      key={testimonial.id}
                      name={testimonial.name}
                      position={testimonial.position}
                      company={testimonial.company}
                      testimonial={testimonial.testimonial}
                      rating={testimonial.rating}
                      imageUrl={testimonial.imageUrl}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>
            
            {testimonials.length > testimonialsPerPage && (
              <div className="flex justify-center gap-4 mt-8">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-6 w-6 text-[#2A9D8F]" />
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(testimonials.length - testimonialsPerPage + 1)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentTestimonialIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentTestimonialIndex 
                          ? 'bg-[#2A9D8F] w-6' 
                          : 'bg-[#2A9D8F]/30'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-6 w-6 text-[#2A9D8F]" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
