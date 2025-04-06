import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { FloatingFeedbackButton } from "@/components/FeedbackDialog";
import { ChatBot } from "@/components/chatbot/ChatBot";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import Admin from "@/pages/Admin";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import DonationSuccess from "@/pages/DonationSuccess";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import FundingGoals from "@/pages/FundingGoals";
import Checkout from "@/pages/Checkout";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/Dashboard";
import Impact from "@/pages/Impact";
import DataInsights from "@/pages/DataInsights";
import CaseStudies from "@/pages/CaseStudies";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import Publications from "@/pages/Publications";
import PublicationDetail from "@/pages/PublicationDetail";
import FAQs from "@/pages/FAQs";

// Service detail pages
import DigitalLiteracy from "@/pages/services/DigitalLiteracy";
import SocialImpact from "@/pages/services/SocialImpact";
import ItConsultancy from "@/pages/services/ItConsultancy";
import WebDevelopment from "@/pages/services/WebDevelopment";
import EnvironmentalResearch from "@/pages/services/EnvironmentalResearch";
import DataAnalytics from "@/pages/services/DataAnalytics";
import CommunityInnovation from "@/pages/services/CommunityInnovation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/:panel*" component={Admin} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/impact" component={Impact} />
      <Route path="/data-insights" component={DataInsights} />
      <Route path="/funding-goals" component={FundingGoals} />
      <Route path="/checkout/:goalId?" component={Checkout} />
      <Route path="/donation-success" component={DonationSuccess} />
      <Route path="/subscription-success" component={SubscriptionSuccess} />
      
      {/* Resource pages */}
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/case-studies/:slug" component={CaseStudyDetail} />
      <Route path="/publications" component={Publications} />
      <Route path="/publications/:id" component={PublicationDetail} />
      <Route path="/faqs" component={FAQs} />
      
      {/* Service detail pages */}
      <Route path="/services/digital-literacy" component={DigitalLiteracy} />
      <Route path="/services/social-impact" component={SocialImpact} />
      <Route path="/services/it-consultancy" component={ItConsultancy} />
      <Route path="/services/web-development" component={WebDevelopment} />
      <Route path="/services/environmental-research" component={EnvironmentalResearch} />
      <Route path="/services/data-analytics" component={DataAnalytics} />
      <Route path="/services/community-innovation" component={CommunityInnovation} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <FloatingFeedbackButton />
        <ChatBot />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
