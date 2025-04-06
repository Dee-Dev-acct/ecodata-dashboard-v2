import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { BlogPost } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogContent from "@/components/blog/BlogContent";

const BlogPostPage = () => {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', slug],
    enabled: !!slug,
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-[#E6F7F4] to-[#D1F5EE] dark:bg-gradient-to-br dark:from-[#1A4D5C] dark:to-[#0F3540] py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link href="/blog" className="inline-flex items-center text-[#2A9D8F] hover:text-[#1F7268] mb-6 transition-colors group">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
              
              {isLoading ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A9D8F]"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">
                  Failed to load blog post. Please try again later.
                </div>
              ) : !post ? (
                <div className="text-center py-8">
                  <h1 className="text-2xl font-heading font-bold mb-4">Post Not Found</h1>
                  <p className="text-gray-600 dark:text-[#F4F1DE]">
                    The blog post you're looking for doesn't exist or has been removed.
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-7 relative inline-block">
                    <span>{post.title}</span>
                    <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
                  </h1>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-[#A8D0D4] mb-8">
                    <span>
                      {new Date(post.publishDate || post.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{post.category}</span>
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="text-xs px-2 py-1 bg-[#EBF9F7] dark:bg-[#1A3C46] text-[#267D72] dark:text-[#9ECBC5] rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {post && (
          <section className="py-12 bg-gradient-to-b from-white to-[#F8FDFC] dark:from-[#2A3B40] dark:to-[#1F2E32]">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto bg-white dark:bg-[#1D3741] p-8 rounded-lg shadow-md">
                <BlogContent content={post.content} />
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
