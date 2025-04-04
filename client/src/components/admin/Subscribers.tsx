import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsletterSubscriber } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Subscribers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: subscribers, isLoading, error } = useQuery<NewsletterSubscriber[]>({
    queryKey: ['/api/admin/subscribers'],
  });
  
  const { mutate: deleteSubscriber, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscribers'] });
      toast({
        title: "Subscriber deleted",
        description: "Subscriber has been removed from the list.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete subscriber.",
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteSubscriber = (id: number) => {
    if (window.confirm("Are you sure you want to remove this subscriber?")) {
      deleteSubscriber(id);
    }
  };
  
  const filteredSubscribers = subscribers?.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate subscription statistics
  const totalSubscribers = subscribers?.length || 0;
  const lastMonthSubscribers = subscribers?.filter(subscriber => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(subscriber.createdAt!) > oneMonthAgo;
  }).length || 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-[#264653] rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 dark:text-[#D1CFC0] mb-1">Total subscribers</div>
          <div className="text-3xl font-bold">{totalSubscribers}</div>
        </div>
        
        <div className="bg-white dark:bg-[#264653] rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 dark:text-[#D1CFC0] mb-1">New this month</div>
          <div className="text-3xl font-bold">{lastMonthSubscribers}</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#264653] rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between">
          <h3 className="text-xl font-heading font-semibold mb-4 md:mb-0">Newsletter Subscribers</h3>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load subscribers.
            </div>
          ) : !filteredSubscribers || filteredSubscribers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
              {searchTerm ? "No subscribers match your search." : "No subscribers yet."}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A323C] text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Subscribe Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-[#D1CFC0] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                    <td className="px-6 py-4 whitespace-nowrap dark:text-[#F4F1DE]">{subscriber.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#D1CFC0]">
                      {new Date(subscriber.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <i className="fas fa-circle-notch fa-spin mr-1"></i>
                        ) : (
                          <i className="far fa-trash-alt mr-1"></i>
                        )}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
