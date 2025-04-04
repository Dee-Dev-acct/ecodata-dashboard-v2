import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ContactMessages = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
  });
  
  const { mutate: markAsRead, isPending: isMarkingRead } = useMutation({
    mutationFn: async ({ id, isRead }: { id: number; isRead: boolean }) => {
      await apiRequest("PUT", `/api/admin/messages/${id}/read`, { isRead });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Status updated",
        description: "Message status has been updated.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    },
  });
  
  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      setSelectedMessage(null);
      toast({
        title: "Message deleted",
        description: "Message has been deleted successfully.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    },
  });
  
  const handleMarkAsRead = (id: number, isRead: boolean) => {
    markAsRead({ id, isRead });
  };
  
  const handleDeleteMessage = (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white dark:bg-[#264653] rounded-lg shadow-md p-4 h-[calc(100vh-12rem)] overflow-auto">
        <h3 className="text-xl font-heading font-semibold mb-4">Messages</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Failed to load messages.
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
            No messages received yet.
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id 
                    ? 'bg-[#2A9D8F] bg-opacity-10 border-l-4 border-[#2A9D8F]' 
                    : message.isRead 
                      ? 'hover:bg-gray-100 dark:hover:bg-[#1A323C]' 
                      : 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:bg-opacity-30 font-medium'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate">{message.name}</div>
                  <div className="text-xs text-gray-500 dark:text-[#D1CFC0] whitespace-nowrap ml-2">
                    {new Date(message.createdAt!).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-[#F4F1DE] truncate">{message.subject}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="lg:col-span-2 bg-white dark:bg-[#264653] rounded-lg shadow-md p-6">
        {selectedMessage ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-heading font-semibold">{selectedMessage.subject}</h3>
                <div className="mt-1 text-sm text-gray-500 dark:text-[#D1CFC0]">
                  From {selectedMessage.name} ({selectedMessage.email}) on {' '}
                  {new Date(selectedMessage.createdAt!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.isRead)}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-opacity-50 transition-colors flex items-center"
                  disabled={isMarkingRead}
                >
                  {isMarkingRead ? (
                    <i className="fas fa-circle-notch fa-spin mr-1"></i>
                  ) : selectedMessage.isRead ? (
                    <i className="far fa-envelope-open mr-1"></i>
                  ) : (
                    <i className="far fa-envelope mr-1"></i>
                  )}
                  {selectedMessage.isRead ? "Mark as unread" : "Mark as read"}
                </button>
                
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-opacity-50 transition-colors flex items-center"
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
            </div>
            
            <div className="bg-gray-50 dark:bg-[#1A323C] rounded-lg p-4 mb-4">
              <div className="whitespace-pre-wrap dark:text-[#F4F1DE]">{selectedMessage.message}</div>
            </div>
            
            <div className="mt-4 text-right">
              <a 
                href={`mailto:${selectedMessage.email}`}
                className="px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#1F7268] transition-colors inline-flex items-center"
              >
                <i className="far fa-paper-plane mr-2"></i>
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 dark:text-[#F4F1DE]">
            <i className="far fa-envelope-open text-5xl mb-4"></i>
            <h3 className="text-lg font-medium mb-1">No message selected</h3>
            <p>Select a message from the list to view its details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
