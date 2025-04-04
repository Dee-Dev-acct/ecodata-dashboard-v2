import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Service, InsertService } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ServiceFormData {
  id?: number;
  title: string;
  description: string;
  icon: string;
}

const ServicesManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    icon: "fa-chart-line"
  });
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const { mutate: createService, isPending: isCreating } = useMutation({
    mutationFn: async (data: InsertService) => {
      const response = await apiRequest("POST", "/api/admin/services", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service created",
        description: "The service has been created successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create service",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: updateService, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertService> }) => {
      const response = await apiRequest("PUT", `/api/admin/services/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service updated",
        description: "The service has been updated successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update service",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: deleteService, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete service",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.icon) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (editMode && formData.id) {
      updateService({
        id: formData.id,
        data: {
          title: formData.title,
          description: formData.description,
          icon: formData.icon
        }
      });
    } else {
      createService({
        title: formData.title,
        description: formData.description,
        icon: formData.icon
      });
    }
  };
  
  const handleEditService = (service: Service) => {
    setFormData({
      id: service.id,
      title: service.title,
      description: service.description,
      icon: service.icon
    });
    setEditMode(true);
  };
  
  const handleDeleteService = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(id);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "fa-chart-line"
    });
    setEditMode(false);
  };
  
  // Icon options
  const iconOptions = [
    { value: "fa-chart-line", label: "Chart Line" },
    { value: "fa-globe-americas", label: "Globe" },
    { value: "fa-server", label: "Server" },
    { value: "fa-users", label: "Users" },
    { value: "fa-project-diagram", label: "Project Diagram" },
    { value: "fa-chalkboard-teacher", label: "Training" },
    { value: "fa-leaf", label: "Leaf" },
    { value: "fa-recycle", label: "Recycle" },
    { value: "fa-database", label: "Database" },
    { value: "fa-chart-pie", label: "Chart Pie" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-[#264653] rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-heading font-semibold">Services</h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load services.
            </div>
          ) : !services || services.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
              No services found. Create your first service!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A323C] text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 bg-[#2A9D8F] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <i className={`fas ${service.icon} text-xl text-[#2A9D8F]`}></i>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-[#F4F1DE]">{service.title}</td>
                    <td className="px-6 py-4 dark:text-[#F4F1DE] max-w-xs truncate">{service.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <i className="far fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
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
          {editMode ? "Edit Service" : "Create New Service"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label htmlFor="icon" className="block mb-2 font-medium dark:text-[#F4F1DE]">Icon</label>
            <div className="flex space-x-3 mb-2">
              {iconOptions.slice(0, 5).map((icon) => (
                <div
                  key={icon.value}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${
                    formData.icon === icon.value
                      ? 'bg-[#2A9D8F] text-white'
                      : 'bg-gray-100 dark:bg-[#1A323C] text-gray-700 dark:text-[#F4F1DE] hover:bg-gray-200 dark:hover:bg-[#1A323C] dark:hover:bg-opacity-70'
                  }`}
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                >
                  <i className={`fas ${icon.value}`}></i>
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              {iconOptions.slice(5, 10).map((icon) => (
                <div
                  key={icon.value}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${
                    formData.icon === icon.value
                      ? 'bg-[#2A9D8F] text-white'
                      : 'bg-gray-100 dark:bg-[#1A323C] text-gray-700 dark:text-[#F4F1DE] hover:bg-gray-200 dark:hover:bg-[#1A323C] dark:hover:bg-opacity-70'
                  }`}
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                >
                  <i className={`fas ${icon.value}`}></i>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium dark:text-[#F4F1DE]">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.description}
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
                editMode ? "Update Service" : "Create Service"
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

export default ServicesManager;
