import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BlogPost } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { Link } from "wouter";
import { Home, ArrowLeft, ArrowRight, RefreshCw, TagIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Blog = () => {
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [retryCount, setRetryCount] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Query for blog posts with retry logic
  const { 
    data: posts, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts', { published: true }],
    queryFn: async () => {
      try {
        const response = await fetch('/api/blog/posts?published=true');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        return response.json();
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        throw new Error('Failed to fetch blog posts. Please check your connection and try again.');
      }
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract unique categories and tags from posts
  useEffect(() => {
    if (posts && posts.length > 0) {
      // Extract unique categories with manual deduplication
      const categoriesMap: Record<string, boolean> = { "all": true };
      posts.forEach(post => {
        const category = post.category.toLowerCase();
        categoriesMap[category] = true;
      });
      setAllCategories(Object.keys(categoriesMap));

      // Extract unique tags
      const tags = posts.reduce((acc: string[], post) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            if (!acc.includes(tag.toLowerCase())) {
              acc.push(tag.toLowerCase());
            }
          });
        }
        return acc;
      }, []);
      setAllTags(tags);
    }
  }, [posts]);

  // Filter posts by category and tag
  const filteredPosts = posts?.filter(post => {
    // Filter by category
    const categoryMatch = selectedCategory === "all" || 
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Filter by tag if selected
    const tagMatch = !selectedTag || 
      (post.tags && post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()));
    
    return categoryMatch && tagMatch;
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts?.slice(indexOfFirstPost, indexOfLastPost) || [];
  const totalPages = filteredPosts ? Math.ceil(filteredPosts.length / postsPerPage) : 0;

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
    setSelectedTag(null); // Clear tag filter when category changes
  };

  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1); // Reset to first page when tag changes
  };

  // Handle manual retry
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
    refetch();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-[#E6F7F4] to-[#D1F5EE] dark:bg-gradient-to-br dark:from-[#1A4D5C] dark:to-[#0F3540] py-16">
          <div className="container mx-auto px-4">
            <div className="relative mb-4 flex justify-start">
              <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-heading font-bold mb-7 relative inline-block"
              >
                <span>Our Blog</span>
                <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]"
              >
                Insights, case studies, and updates from our team of environmental data specialists.
              </motion.p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-white to-[#F8FDFC] dark:from-[#2A3B40] dark:to-[#1F2E32]">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-20 h-20">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-[#2A9D8F]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#2A9D8F]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 6v6l4 2" />
                      <path d="M5 10v8" />
                      <path d="M19 10v8" />
                      <path d="M5 18c0 1 1.5 2 7 2s7-1 7-2" />
                      <path d="M5 10c0 1 1.5 2 7 2s7-1 7-2" />
                    </svg>
                  </div>
                </div>
                <p className="text-primary mt-4">Loading posts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 px-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 max-w-2xl mx-auto">
                <div className="text-red-500 dark:text-red-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold">Unable to load blog posts</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We're having trouble connecting to our servers. This could be due to network issues or server maintenance.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleRetry} 
                  className="inline-flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                {/* Category filtering with tabs */}
                <div className="mb-10">
                  <Tabs 
                    defaultValue="all" 
                    value={selectedCategory}
                    className="w-full"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h2 className="text-2xl font-bold mb-4 sm:mb-0 flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-primary" />
                        Browse by Category
                      </h2>
                      {selectedTag && (
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Filtered by tag:</span>
                          <Badge 
                            variant="secondary"
                            className="flex items-center cursor-pointer hover:bg-secondary/80"
                            onClick={() => setSelectedTag(null)}
                          >
                            {selectedTag}
                            <span className="ml-1">×</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                    <TabsList className="flex flex-wrap justify-center mb-8 bg-transparent border p-1 rounded-md">
                      {allCategories.map((category) => (
                        <TabsTrigger 
                          key={category} 
                          value={category}
                          onClick={() => handleCategoryChange(category)}
                          className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Tags cloud if we have tags */}
                    {allTags.length > 0 && (
                      <div className="mb-8">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 mt-1">Popular Tags:</span>
                          {allTags.slice(0, 15).map((tag) => (
                            <Badge 
                              key={tag}
                              variant={selectedTag === tag ? "default" : "outline"}
                              className="capitalize cursor-pointer"
                              onClick={() => handleTagClick(tag)}
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <TabsContent value={selectedCategory} className="mt-0">
                      {filteredPosts && filteredPosts.length > 0 ? (
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                          {currentPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                          ))}
                        </motion.div>
                      ) : (
                        <div className="text-center py-8 bg-muted rounded-lg p-8">
                          <div className="text-xl font-heading font-bold mb-4">No Posts in This Category</div>
                          <p className="text-gray-600 dark:text-[#F4F1DE] mb-4">
                            We couldn't find any posts in the '{selectedCategory}' category
                            {selectedTag ? ` with the tag '${selectedTag}'` : ''}.
                          </p>
                          <Button onClick={() => {
                            setSelectedCategory('all');
                            setSelectedTag(null);
                          }}>
                            View All Posts
                          </Button>
                        </div>
                      )}
                      
                      {/* Pagination */}
                      {filteredPosts && filteredPosts.length > postsPerPage && (
                        <div className="flex justify-center mt-12 space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 p-0"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, index) => (
                              <Button
                                key={index}
                                variant={currentPage === index + 1 ? "default" : "outline"}
                                onClick={() => setCurrentPage(index + 1)}
                                className="w-10 h-10 p-0"
                              >
                                {index + 1}
                              </Button>
                            ))}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 p-0"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-muted rounded-lg shadow-sm border border-border/40 max-w-4xl mx-auto">
                <div className="text-2xl font-heading font-bold mb-4">No Posts Yet</div>
                <p className="text-gray-600 dark:text-[#F4F1DE] max-w-md mx-auto mb-8">
                  We're currently working on creating interesting content about environmental data, sustainability
                  initiatives, and our latest projects. Please check back soon!
                </p>
                <Link href="/">
                  <Button>
                    Back to Homepage
                  </Button>
                </Link>
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
