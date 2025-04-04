import { useState, useEffect } from "react";
import { useLocation, useRoute, Redirect } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import ContactMessages from "@/components/admin/ContactMessages";
import Subscribers from "@/components/admin/Subscribers";
import ServicesManager from "@/components/admin/ServicesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ImpactMetricsManager from "@/components/admin/ImpactMetricsManager";
import BlogManager from "@/components/admin/BlogManager";

const Admin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [match, params] = useRoute("/admin/:panel*");
  const [, setLocation] = useLocation();
  const [activePanel, setActivePanel] = useState<string>("dashboard");

  useEffect(() => {
    if (match && params?.panel) {
      setActivePanel(params.panel);
    } else {
      setActivePanel("dashboard");
    }
  }, [match, params]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  // Redirect to homepage if authenticated but not admin
  if (!isAdmin) {
    return <Redirect to="/" />;
  }
  
  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <Dashboard />;
      case "messages":
        return <ContactMessages />;
      case "subscribers":
        return <Subscribers />;
      case "services":
        return <ServicesManager />;
      case "testimonials":
        return <TestimonialsManager />;
      case "impact-metrics":
        return <ImpactMetricsManager />;
      case "blog":
        return <BlogManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout activePanel={activePanel}>
      {renderPanel()}
    </AdminLayout>
  );
};

export default Admin;
