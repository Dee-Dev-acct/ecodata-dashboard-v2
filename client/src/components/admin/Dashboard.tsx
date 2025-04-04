import { useQuery } from "@tanstack/react-query";
import { 
  ContactMessage, 
  NewsletterSubscriber, 
  BlogPost, 
  Service, 
  Testimonial,
  ImpactMetric
} from "@shared/schema";

const Dashboard = () => {
  const { data: messages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
  });
  
  const { data: subscribers, isLoading: subscribersLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ['/api/admin/subscribers'],
  });
  
  const { data: blogPosts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });
  
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  const { data: impactMetrics, isLoading: metricsLoading } = useQuery<ImpactMetric[]>({
    queryKey: ['/api/impact-metrics'],
  });
  
  const statCards = [
    {
      title: "Total Contact Messages",
      value: messagesLoading ? "..." : messages?.length || 0,
      icon: "fa-envelope",
      color: "blue",
      route: "/admin/messages"
    },
    {
      title: "Newsletter Subscribers",
      value: subscribersLoading ? "..." : subscribers?.length || 0,
      icon: "fa-users",
      color: "green",
      route: "/admin/subscribers"
    },
    {
      title: "Blog Posts",
      value: postsLoading ? "..." : blogPosts?.length || 0,
      icon: "fa-blog",
      color: "purple",
      route: "/admin/blog"
    },
    {
      title: "Services",
      value: servicesLoading ? "..." : services?.length || 0,
      icon: "fa-server",
      color: "orange",
      route: "/admin/services"
    }
  ];
  
  const getUnreadMessagesCount = () => {
    if (messagesLoading || !messages) return 0;
    return messages.filter(msg => !msg.isRead).length;
  };
  
  const getRecentMessages = () => {
    if (messagesLoading || !messages) return [];
    return messages.sort((a, b) => {
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }).slice(0, 5);
  };
  
  const getRecentSubscribers = () => {
    if (subscribersLoading || !subscribers) return [];
    return subscribers.sort((a, b) => {
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }).slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#264653] rounded-lg shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900 dark:bg-opacity-20`}>
                <i className={`fas ${card.icon} text-xl text-${card.color}-600 dark:text-${card.color}-400`}></i>
              </div>
              <h3 className="ml-4 font-heading font-medium text-gray-800 dark:text-[#F4F1DE]">{card.title}</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{card.value}</div>
            <a 
              href={card.route} 
              className="text-[#2A9D8F] hover:text-[#238277] dark:text-[#38B593] dark:hover:text-[#2C9479] text-sm flex items-center"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = card.route;
              }}
            >
              View Details
              <i className="fas fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white dark:bg-[#264653] rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-heading font-semibold">Recent Messages</h3>
            {getUnreadMessagesCount() > 0 && (
              <span className="bg-red-100 text-red-600 dark:bg-red-900 dark:bg-opacity-20 dark:text-red-400 px-2 py-1 rounded-full text-xs">
                {getUnreadMessagesCount()} unread
              </span>
            )}
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
              </div>
            ) : getRecentMessages().length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
                No messages yet.
              </div>
            ) : (
              getRecentMessages().map((message) => (
                <div key={message.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="font-medium text-gray-900 dark:text-[#F4F1DE]">{message.name}</div>
                        {!message.isRead && (
                          <span className="ml-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-[#D1CFC0] mb-2">
                        {message.email} • {new Date(message.createdAt!).toLocaleDateString()}
                      </div>
                      <p className="text-gray-600 dark:text-[#F4F1DE] line-clamp-2">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a 
              href="/admin/messages" 
              className="text-[#2A9D8F] hover:text-[#238277] dark:text-[#38B593] dark:hover:text-[#2C9479] text-sm flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/admin/messages";
              }}
            >
              View All Messages
              <i className="fas fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
        </div>
        
        {/* Recent Subscribers */}
        <div className="bg-white dark:bg-[#264653] rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-heading font-semibold">Recent Subscribers</h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {subscribersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2A9D8F]"></div>
              </div>
            ) : getRecentSubscribers().length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-[#F4F1DE]">
                No subscribers yet.
              </div>
            ) : (
              getRecentSubscribers().map((subscriber) => (
                <div key={subscriber.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#1A323C]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-[#F4F1DE]">{subscriber.email}</div>
                      <div className="text-sm text-gray-500 dark:text-[#D1CFC0]">
                        Joined {new Date(subscriber.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-600 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                      Active
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a 
              href="/admin/subscribers" 
              className="text-[#2A9D8F] hover:text-[#238277] dark:text-[#38B593] dark:hover:text-[#2C9479] text-sm flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/admin/subscribers";
              }}
            >
              View All Subscribers
              <i className="fas fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#264653] rounded-lg shadow-md p-6">
        <h3 className="text-xl font-heading font-semibold mb-4">Content Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-[#F4F1DE] border-b border-gray-200 dark:border-gray-700 pb-2">Services</h4>
            {servicesLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#2A9D8F]"></div>
              </div>
            ) : (services && services.length > 0) ? (
              <ul className="space-y-2">
                {services.slice(0, 3).map((service) => (
                  <li key={service.id} className="flex items-center">
                    <i className={`fas ${service.icon} w-5 text-[#2A9D8F]`}></i>
                    <span className="ml-2 dark:text-[#F4F1DE]">{service.title}</span>
                  </li>
                ))}
                {services.length > 3 && (
                  <li className="text-sm text-gray-500 dark:text-[#D1CFC0]">
                    {services.length - 3} more {services.length - 3 === 1 ? 'service' : 'services'}...
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-[#D1CFC0]">No services added yet.</div>
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-[#F4F1DE] border-b border-gray-200 dark:border-gray-700 pb-2">Testimonials</h4>
            {testimonialsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#2A9D8F]"></div>
              </div>
            ) : (testimonials && testimonials.length > 0) ? (
              <ul className="space-y-2">
                {testimonials.slice(0, 3).map((testimonial) => (
                  <li key={testimonial.id} className="flex items-center">
                    <i className="fas fa-quote-left w-5 text-[#2A9D8F]"></i>
                    <span className="ml-2 dark:text-[#F4F1DE]">{testimonial.name}</span>
                  </li>
                ))}
                {testimonials.length > 3 && (
                  <li className="text-sm text-gray-500 dark:text-[#D1CFC0]">
                    {testimonials.length - 3} more {testimonials.length - 3 === 1 ? 'testimonial' : 'testimonials'}...
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-[#D1CFC0]">No testimonials added yet.</div>
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-[#F4F1DE] border-b border-gray-200 dark:border-gray-700 pb-2">Impact Metrics</h4>
            {metricsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#2A9D8F]"></div>
              </div>
            ) : (impactMetrics && impactMetrics.length > 0) ? (
              <ul className="space-y-2">
                {impactMetrics.slice(0, 3).map((metric) => (
                  <li key={metric.id} className="flex items-center">
                    <i className={`fas ${metric.icon} w-5 text-[#2A9D8F]`}></i>
                    <span className="ml-2 dark:text-[#F4F1DE]">{metric.title}: {metric.value}</span>
                  </li>
                ))}
                {impactMetrics.length > 3 && (
                  <li className="text-sm text-gray-500 dark:text-[#D1CFC0]">
                    {impactMetrics.length - 3} more {impactMetrics.length - 3 === 1 ? 'metric' : 'metrics'}...
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-[#D1CFC0]">No impact metrics added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;