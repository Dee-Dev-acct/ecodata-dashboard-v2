import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost, InsertBlogPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface BlogPostFormData {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  tags: string;
  category: string;
  published: boolean;
  publishDate?: string;
}

const BlogManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    tags: "",
    category: "news",
    published: false,
    publishDate: ""
  });
  
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });
  
  const { mutate: createBlogPost, isPending: isCreating } = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest("POST", "/api/admin/blog/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post created",
        description: "The blog post has been created successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create blog post",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: updateBlogPost, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogPost> }) => {
      const response = await apiRequest("PUT", `/api/admin/blog/posts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update blog post",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: deleteBlogPost, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
      
      // Auto-generate slug from title
      if (name === 'title' && !editMode) {
        const slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        setFormData((prev) => ({
          ...prev,
          slug
        }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert tags string to array
    const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
    
    // Prepare the data
    const postData = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      authorId: user?.id || 1, // Default to user ID 1 if not available
      featuredImage: formData.featuredImage || undefined,
      tags,
      category: formData.category,
      published: formData.published,
      publishDate: formData.published ? (formData.publishDate ? new Date(formData.publishDate).toISOString() : new Date().toISOString()) : undefined
    };
    
    if (editMode && formData.id) {
      updateBlogPost({
        id: formData.id,
        data: postData
      });
    } else {
      createBlogPost(postData);
    }
  };
  
  const handleEditBlogPost = (post: BlogPost) => {
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage || "",
      tags: post.tags ? post.tags.join(', ') : "",
      category: post.category,
      published: post.published,
      publishDate: post.publishDate ? new Date(post.publishDate).toISOString().split('T')[0] : ""
    });
    setEditMode(true);
  };
  
  const handleDeleteBlogPost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPost(id);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      tags: "",
      category: "news",
      published: false,
      publishDate: ""
    });
    setEditMode(false);
  };
  
  // Category options
  const categoryOptions = [
    { value: "news", label: "News" },
    { value: "case-study", label: "Case Study" },
    { value: "research", label: "Research" },
    { value: "technology", label: "Technology" },
    { value: "environment", label: "Environment" },
    { value: "social-impact", label: "Social Impact" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-[#264653] rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-heading font-semibold">Blog Posts</h3>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-12rem)]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load blog posts.
            </div>
          ) : !blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
              No blog posts found. Create your first post!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium dark:text-[#F4F1DE]">{post.title}</h4>
                      <div className="flex text-xs text-gray-500 dark:text-[#D1CFC0] space-x-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        <span>{post.category}</span>
                        <span>
                          {post.publishDate 
                            ? new Date(post.publishDate).toLocaleDateString() 
                            : new Date(post.createdAt!).toLocaleDateString()
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-[#F4F1DE] mt-2 line-clamp-2">{post.excerpt}</p>
                    </div>
                    
                    <div className="flex space-x-3 ml-4">
                      <button
                        onClick={() => handleEditBlogPost(post)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <i className="far fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteBlogPost(post.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                          <i className="far fa-trash-alt"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="lg:col-span-3 bg-white dark:bg-[#264653] rounded-lg shadow-md p-6">
        <h3 className="text-xl font-heading font-semibold mb-4">
          {editMode ? "Edit Blog Post" : "Create New Blog Post"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block mb-2 font-medium dark:text-[#F4F1DE]">Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block mb-2 font-medium dark:text-[#F4F1DE]">Slug</label>
              <input 
                type="text" 
                id="slug" 
                name="slug" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="category" className="block mb-2 font-medium dark:text-[#F4F1DE]">Category</label>
              <select 
                id="category" 
                name="category" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="tags" className="block mb-2 font-medium dark:text-[#F4F1DE]">Tags (comma separated)</label>
              <input 
                type="text" 
                id="tags" 
                name="tags" 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. research, data, environment"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="featuredImage" className="block mb-2 font-medium dark:text-[#F4F1DE]">Featured Image URL (optional)</label>
            <input 
              type="text" 
              id="featuredImage" 
              name="featuredImage" 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.featuredImage || ""}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="excerpt" className="block mb-2 font-medium dark:text-[#F4F1DE]">Excerpt</label>
            <textarea 
              id="excerpt" 
              name="excerpt" 
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.excerpt}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 font-medium dark:text-[#F4F1DE]">Content</label>
            <textarea 
              id="content" 
              name="content" 
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.content}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="published" 
                name="published" 
                className="w-4 h-4 text-[#2A9D8F] border-gray-300 rounded focus:ring-[#2A9D8F]"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <label htmlFor="published" className="ml-2 font-medium dark:text-[#F4F1DE]">Publish immediately</label>
            </div>
            
            {formData.published && (
              <div>
                <label htmlFor="publishDate" className="block mb-2 font-medium dark:text-[#F4F1DE]">Publish Date</label>
                <input 
                  type="date" 
                  id="publishDate" 
                  name="publishDate" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="submit" 
              className="px-4 py-2 bg-[#2A9D8F] hover:bg-[#1F7268] text-white font-medium rounded-lg transition-colors flex-grow"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <div className="flex items-center justify-center">
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  {editMode ? "Updating..." : "Creating..."}
                </div>
              ) : (
                editMode ? "Update Blog Post" : "Create Blog Post"
              )}
            </button>
            
            {editMode && (
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-200 dark:bg-[#1A323C] hover:bg-gray-300 dark:hover:bg-[#1A323C] dark:hover:bg-opacity-70 text-gray-800 dark:text-[#F4F1DE] font-medium rounded-lg transition-colors"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogManager;
