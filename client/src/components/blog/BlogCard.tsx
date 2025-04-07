import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, BarChart } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const formattedDate = post.publishDate 
    ? new Date(post.publishDate).toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date(post.createdAt!).toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  // Default image if none provided
  const imageUrl = post.featuredImage || 'https://placehold.co/600x400/e2e8f0/1e293b?text=ECODATA';
  
  // Estimate read time based on content length (rough estimate)
  const readTimeEstimate = () => {
    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute reading speed
    return readTime < 1 ? 1 : readTime;
  };
  
  // Animation variants for card
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.1, // Staggered animation based on index
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.2,
      }
    }
  };
  
  // Animation variants for image
  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <motion.div 
      className="h-full group bg-gradient-to-b from-white to-[#FAFFFE] dark:from-[#264653] dark:to-[#1D3741] rounded-lg shadow-md overflow-hidden border border-transparent hover:border-[#E0F3F0] dark:hover:border-[#345E6A] flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        <div className="block flex-grow flex flex-col">
          <div className="relative overflow-hidden">
            <motion.img 
              src={imageUrl} 
              alt={post.title} 
              variants={imageVariants}
              className="w-full h-52 object-cover"
            />
            <div className="absolute top-0 right-0 bg-[#2A9D8F]/90 text-white px-2 py-1 text-xs uppercase tracking-wider rounded-bl-md">
              {post.category}
            </div>
          </div>
          
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex items-center text-sm text-gray-500 dark:text-[#A8D0D4] mb-3 space-x-3">
              <div className="inline-flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>{formattedDate}</span>
              </div>
              <div className="inline-flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>{readTimeEstimate()} min read</span>
              </div>
            </div>
            
            <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-[#2A9D8F] transition-colors dark:text-[#F4F1DE] line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-600 dark:text-[#E3E8EA] mb-4 line-clamp-3 flex-grow">
              {post.excerpt}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 bg-[#EBF9F7] dark:bg-[#1A3C46] text-[#267D72] dark:text-[#9ECBC5] rounded-full transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            <div className="inline-flex items-center text-[#2A9D8F] font-medium group-hover:text-[#1F7B70] dark:group-hover:text-[#4DD4C1] transition-colors mt-auto">
              Read full article
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1 group-hover:translate-x-1.5 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;