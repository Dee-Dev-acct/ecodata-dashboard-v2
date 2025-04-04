import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";

const TestimonialCard = ({ 
  name, 
  position, 
  company, 
  testimonial, 
  rating, 
  imageUrl 
}: { 
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  imageUrl?: string;
}) => {
  return (
    <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <img 
          src={imageUrl || "https://randomuser.me/api/portraits/lego/1.jpg"} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-[#F4F1DE]">{position}, {company}</p>
        </div>
      </div>
      <div className="mb-3 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fas ${i < rating ? 'fa-star' : i + 0.5 === rating ? 'fa-star-half-alt' : 'fa-star text-gray-300'}`}
          ></i>
        ))}
      </div>
      <p className="italic dark:text-[#F4F1DE]">
        "{testimonial}"
      </p>
    </div>
  );
};

const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  return (
    <section className="py-16 bg-white dark:bg-[#333333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4 relative inline-block">
            <span className="relative z-10">Client Testimonials</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-[#2A9D8F] opacity-20 -rotate-1"></span>
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
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) => (
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
        )}
      </div>
    </section>
  );
};

export default Testimonials;
