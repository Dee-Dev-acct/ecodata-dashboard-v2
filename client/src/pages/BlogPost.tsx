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
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-[#F4F1DE] dark:bg-[#264653] py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link href="/blog" className="inline-flex items-center text-[#2A9D8F] hover:text-[#1F7268] mb-6 transition-colors">
                <i className="fas fa-arrow-left mr-2"></i> Back to Blog
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
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{post.title}</h1>
                  <div className="flex items-center text-sm text-gray-600 dark:text-[#D1CFC0] mb-8">
                    <span>
                      {new Date(post.publishDate || post.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{post.category}</span>
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex flex-wrap">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="mr-2">#{tag}</span>
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
          <section className="py-12 bg-white dark:bg-[#333333]">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
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
