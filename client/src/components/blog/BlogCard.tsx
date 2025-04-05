import { Link } from "wouter";
import { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = post.publishDate 
    ? new Date(post.publishDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date(post.createdAt!).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  // Default image if none provided
  const imageUrl = post.featuredImage || 'https://placehold.co/600x400/e2e8f0/1e293b?text=ECODATA';

  return (
    <div className="group bg-gradient-to-b from-white to-[#FAFFFE] dark:from-[#264653] dark:to-[#1D3741] rounded-lg shadow-md overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg border border-transparent hover:border-[#E0F3F0] dark:hover:border-[#345E6A]">
      <Link href={`/blog/${post.slug}`}>
        <div className="block">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-[#A8D0D4] mb-2">
              <span className="capitalize">{post.category}</span>
              <span className="mx-2">•</span>
              <span>{formattedDate}</span>
            </div>
            
            <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-[#2A9D8F] transition-colors dark:text-[#F4F1DE]">
              {post.title}
            </h3>
            
            <p className="text-gray-600 dark:text-[#E3E8EA] mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center">
              <div className="inline-flex items-center text-[#2A9D8F] font-medium group-hover:text-[#1F7B70] dark:group-hover:text-[#4DD4C1] transition-colors">
                Read more
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-[#EBF9F7] dark:bg-[#1A3C46] text-[#267D72] dark:text-[#9ECBC5] rounded-full transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;