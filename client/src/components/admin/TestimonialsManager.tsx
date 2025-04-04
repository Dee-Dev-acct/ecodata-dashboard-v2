import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Testimonial, InsertTestimonial } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TestimonialFormData {
  id?: number;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  imageUrl?: string;
}

const TestimonialsManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    position: "",
    company: "",
    testimonial: "",
    rating: 5,
    imageUrl: ""
  });
  
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  const { mutate: createTestimonial, isPending: isCreating } = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      const response = await apiRequest("POST", "/api/admin/testimonials", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: "Testimonial created",
        description: "The testimonial has been created successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create testimonial",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: updateTestimonial, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTestimonial> }) => {
      const response = await apiRequest("PUT", `/api/admin/testimonials/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: "Testimonial updated",
        description: "The testimonial has been updated successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update testimonial",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: deleteTestimonial, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete testimonial",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.company || !formData.testimonial) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const testimonialData = {
      name: formData.name,
      position: formData.position,
      company: formData.company,
      testimonial: formData.testimonial,
      rating: formData.rating,
      imageUrl: formData.imageUrl || undefined
    };
    
    if (editMode && formData.id) {
      updateTestimonial({
        id: formData.id,
        data: testimonialData
      });
    } else {
      createTestimonial(testimonialData);
    }
  };
  
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setFormData({
      id: testimonial.id,
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      testimonial: testimonial.testimonial,
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl
    });
    setEditMode(true);
  };
  
  const handleDeleteTestimonial = (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonial(id);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      company: "",
      testimonial: "",
      rating: 5,
      imageUrl: ""
    });
    setEditMode(false);
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fas ${i < rating ? 'fa-star' : 'fa-star text-gray-300 dark:text-gray-600'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-[#264653] rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-heading font-semibold">Testimonials</h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load testimonials.
            </div>
          ) : !testimonials || testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
              No testimonials found. Create your first testimonial!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A323C] text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Testimonial</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {testimonial.imageUrl && (
                          <img 
                            src={testimonial.imageUrl} 
                            alt={testimonial.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <span className="dark:text-[#F4F1DE]">{testimonial.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-[#F4F1DE]">
                      {testimonial.position}, {testimonial.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(testimonial.rating)}
                    </td>
                    <td className="px-6 py-4 dark:text-[#F4F1DE] max-w-xs truncate">"{testimonial.testimonial}"</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditTestimonial(testimonial)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <i className="far fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <i className="fas fa-circle-notch fa-spin mr-1"></i>
                          ) : (
                            <i className="far fa-trash-alt mr-1"></i>
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="lg:col-span-1 bg-white dark:bg-[#264653] rounded-lg shadow-md p-6">
        <h3 className="text-xl font-heading font-semibold mb-4">
          {editMode ? "Edit Testimonial" : "Create New Testimonial"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium dark:text-[#F4F1DE]">Client Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="position" className="block mb-2 font-medium dark:text-[#F4F1DE]">Position</label>
            <input 
              type="text" 
              id="position" 
              name="position" 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="company" className="block mb-2 font-medium dark:text-[#F4F1DE]">Company</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block mb-2 font-medium dark:text-[#F4F1DE]">Profile Image URL (optional)</label>
            <input 
              type="text" 
              id="imageUrl" 
              name="imageUrl" 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.imageUrl || ""}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium dark:text-[#F4F1DE]">Rating</label>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div 
                  key={rating}
                  className="cursor-pointer"
                  onClick={() => setFormData({ ...formData, rating })}
                >
                  <i 
                    className={`fas fa-star text-2xl ${formData.rating >= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  ></i>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="testimonial" className="block mb-2 font-medium dark:text-[#F4F1DE]">Testimonial Text</label>
            <textarea 
              id="testimonial" 
              name="testimonial" 
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.testimonial}
              onChange={handleInputChange}
              required
            ></textarea>
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
                editMode ? "Update Testimonial" : "Create Testimonial"
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

export default TestimonialsManager;
