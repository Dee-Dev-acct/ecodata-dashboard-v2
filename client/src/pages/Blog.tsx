import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts', { published: true }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-[#F4F1DE] dark:bg-[#264653] py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-heading font-bold mb-4 relative inline-block">
                <span className="relative z-10">Our Blog</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-[#2A9D8F] opacity-20 -rotate-1"></span>
              </h1>
              <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
                Insights, case studies, and updates from our team of environmental data specialists.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white dark:bg-[#333333]">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A9D8F]"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                Failed to load blog posts. Please try again later.
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl font-heading font-bold mb-4">No Posts Yet</div>
                <p className="text-gray-600 dark:text-[#F4F1DE]">
                  We're working on creating interesting content. Please check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
