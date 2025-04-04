import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  activePanel: string;
}

const AdminSidebar = ({ activePanel }: AdminSidebarProps) => {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      setLocation("/");
    }
  };
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "fa-chart-pie" },
    { id: "messages", label: "Contact Messages", icon: "fa-envelope" },
    { id: "subscribers", label: "Newsletter Subscribers", icon: "fa-users" },
    { id: "services", label: "Services", icon: "fa-server" },
    { id: "testimonials", label: "Testimonials", icon: "fa-quote-right" },
    { id: "impact-metrics", label: "Impact Metrics", icon: "fa-chart-line" },
    { id: "blog", label: "Blog Posts", icon: "fa-blog" }
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-[#264653] md:h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4">
        <div className="bg-[#2A9D8F] text-white rounded-lg p-4 mb-6">
          <div className="text-sm">Admin Panel</div>
          <div className="text-lg font-semibold">ECODATA CIC</div>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setLocation(`/admin/${item.id}`)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activePanel === item.id
                      ? 'bg-[#2A9D8F] bg-opacity-10 text-[#2A9D8F] dark:text-[#38B593] font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-[#1A323C] dark:text-[#F4F1DE]'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 text-center mr-3`}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
            <button
              onClick={() => setLocation("/")}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
            >
              <i className="fas fa-home w-5 text-center mr-3"></i>
              <span>Return to Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A323C] text-red-600 dark:text-red-400 transition-colors"
            >
              <i className="fas fa-sign-out-alt w-5 text-center mr-3"></i>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
