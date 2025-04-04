import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImpactMetric, InsertImpactMetric } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImpactMetricFormData {
  id?: number;
  title: string;
  value: string;
  description: string;
  icon: string;
  category: string;
}

const ImpactMetricsManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<ImpactMetricFormData>({
    title: "",
    value: "",
    description: "",
    icon: "fa-chart-line",
    category: "environmental"
  });
  
  const { data: metrics, isLoading, error } = useQuery<ImpactMetric[]>({
    queryKey: ['/api/impact-metrics'],
  });
  
  const { mutate: createMetric, isPending: isCreating } = useMutation({
    mutationFn: async (data: InsertImpactMetric) => {
      const response = await apiRequest("POST", "/api/admin/impact-metrics", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/impact-metrics'] });
      toast({
        title: "Impact metric created",
        description: "The impact metric has been created successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create impact metric",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: updateMetric, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertImpactMetric> }) => {
      const response = await apiRequest("PUT", `/api/admin/impact-metrics/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/impact-metrics'] });
      toast({
        title: "Impact metric updated",
        description: "The impact metric has been updated successfully.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update impact metric",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: deleteMetric, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/impact-metrics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/impact-metrics'] });
      toast({
        title: "Impact metric deleted",
        description: "The impact metric has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete impact metric",
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
    
    if (!formData.title || !formData.value || !formData.description || !formData.icon || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (editMode && formData.id) {
      updateMetric({
        id: formData.id,
        data: {
          title: formData.title,
          value: formData.value,
          description: formData.description,
          icon: formData.icon,
          category: formData.category
        }
      });
    } else {
      createMetric({
        title: formData.title,
        value: formData.value,
        description: formData.description,
        icon: formData.icon,
        category: formData.category
      });
    }
  };
  
  const handleEditMetric = (metric: ImpactMetric) => {
    setFormData({
      id: metric.id,
      title: metric.title,
      value: metric.value,
      description: metric.description,
      icon: metric.icon,
      category: metric.category
    });
    setEditMode(true);
  };
  
  const handleDeleteMetric = (id: number) => {
    if (window.confirm("Are you sure you want to delete this impact metric?")) {
      deleteMetric(id);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      value: "",
      description: "",
      icon: "fa-chart-line",
      category: "environmental"
    });
    setEditMode(false);
  };
  
  // Icon options
  const iconOptions = [
    { value: "fa-chart-line", label: "Chart Line" },
    { value: "fa-users", label: "Users" },
    { value: "fa-recycle", label: "Recycle" },
    { value: "fa-tree", label: "Tree" },
    { value: "fa-water", label: "Water" },
    { value: "fa-leaf", label: "Leaf" },
    { value: "fa-globe", label: "Globe" },
    { value: "fa-solar-panel", label: "Solar Panel" },
    { value: "fa-seedling", label: "Seedling" },
    { value: "fa-hand-holding-heart", label: "Hand Holding Heart" }
  ];
  
  // Category options
  const categoryOptions = [
    { value: "environmental", label: "Environmental" },
    { value: "social", label: "Social" },
    { value: "efficiency", label: "Efficiency" },
    { value: "economic", label: "Economic" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-[#264653] rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-heading font-semibold">Impact Metrics</h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load impact metrics.
            </div>
          ) : !metrics || metrics.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
              No impact metrics found. Create your first metric!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A323C] text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.map((metric) => (
                  <tr key={metric.id} className="hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 bg-opacity-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: metric.category === 'environmental' ? 'rgba(42, 157, 143, 0.1)' : 
                                          metric.category === 'social' ? 'rgba(69, 123, 157, 0.1)' : 
                                          metric.category === 'efficiency' ? 'rgba(76, 175, 80, 0.1)' : 
                                          'rgba(42, 157, 143, 0.1)'
                        }}
                      >
                        <i className={`fas ${metric.icon} text-xl`}
                          style={{
                            color: metric.category === 'environmental' ? '#2A9D8F' : 
                                  metric.category === 'social' ? '#457B9D' : 
                                  metric.category === 'efficiency' ? '#4CAF50' : 
                                  '#2A9D8F'
                          }}
                        ></i>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-[#F4F1DE]">{metric.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-[#F4F1DE]">{metric.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-[#F4F1DE] capitalize">{metric.category}</td>
                    <td className="px-6 py-4 dark:text-[#F4F1DE] max-w-xs truncate">{metric.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditMetric(metric)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <i className="far fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMetric(metric.id)}
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
          {editMode ? "Edit Impact Metric" : "Create New Impact Metric"}
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
            <label htmlFor="value" className="block mb-2 font-medium dark:text-[#F4F1DE]">Value</label>
            <input 
              type="text" 
              id="value" 
              name="value" 
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="e.g. 247 tonnes"
              required
            />
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label htmlFor="icon" className="block mb-2 font-medium dark:text-[#F4F1DE]">Icon</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {iconOptions.map((icon) => (
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
                editMode ? "Update Metric" : "Create Metric"
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

export default ImpactMetricsManager;
