import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Header from "@/components/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePanel: string;
}

const AdminLayout = ({ children, activePanel }: AdminLayoutProps) => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return null; // Should not render if not authenticated or not admin
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex flex-col md:flex-row bg-gray-100 dark:bg-[#333333]">
        <AdminSidebar activePanel={activePanel} />
        
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-[#D1CFC0]">Welcome back, {user.username}</p>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
