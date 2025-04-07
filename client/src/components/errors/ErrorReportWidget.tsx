import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  X, 
  ChevronUp, 
  ChevronDown, 
  SendHorizonal, 
  CheckCircle2,
  MessageSquare,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ErrorReportWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  accentColor?: string;
}

const ErrorReportWidget: React.FC<ErrorReportWidgetProps> = ({ 
  position = 'bottom-right',
  accentColor = '#2A9D8F'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // When opening, collect system info
      collectSystemInfo();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const collectSystemInfo = () => {
    // Get current page URL
    setCurrentPage(window.location.href);
    
    // Get browser and system info
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    
    setBrowserInfo(JSON.stringify(browserInfo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!errorDetails.trim()) {
      toast({
        title: "Error details required",
        description: "Please describe the issue you're experiencing",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit error report to backend
      const response = await apiRequest('POST', '/api/error-reports', {
        email,
        errorDetails,
        currentPage,
        browserInfo: JSON.parse(browserInfo),
        reportedAt: new Date().toISOString()
      });
      
      if (response.ok) {
        setIsSubmitSuccess(true);
        toast({
          title: "Report submitted",
          description: "Thank you for helping us improve our site",
        });
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setIsSubmitSuccess(false);
          setErrorDetails('');
          setEmail('');
          setIsOpen(false);
        }, 2000);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Position classes based on prop
  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Toggle button */}
      <motion.button
        onClick={toggleWidget}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg focus:outline-none`}
        style={{ backgroundColor: accentColor }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Bug className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Widget panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`absolute ${position === 'bottom-right' ? 'bottom-16 right-0' : 'bottom-16 left-0'} w-80 bg-card border border-border shadow-xl rounded-lg overflow-hidden`}
          >
            <div 
              className="p-4 font-semibold flex items-center justify-between"
              style={{ backgroundColor: accentColor, color: 'white' }}
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>Report an Issue</span>
              </div>
              <button 
                onClick={toggleExpand}
                className="text-white hover:bg-white/20 p-1 rounded"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="p-4">
              {isSubmitSuccess ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                  <p className="text-center">Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="errorDetails" className="block text-sm font-medium mb-1">
                        Describe the issue
                      </label>
                      <Textarea
                        id="errorDetails"
                        value={errorDetails}
                        onChange={(e) => setErrorDetails(e.target.value)}
                        placeholder="Tell us what went wrong..."
                        className="w-full"
                        rows={isExpanded ? 5 : 3}
                      />
                    </div>
                    
                    {isExpanded && (
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email (optional)
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="For us to contact you about this issue"
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        <MessageSquare className="inline-block w-3 h-3 mr-1" />
                        We appreciate your feedback
                      </div>
                      <Button 
                        type="submit" 
                        style={{ backgroundColor: accentColor }}
                        disabled={isSubmitting || !errorDetails.trim()}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <SendHorizonal className="w-4 h-4 mr-1" />
                            Send
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            {isExpanded && (
              <div className="px-4 pb-4 pt-0">
                <div className="text-xs text-muted-foreground border-t pt-3">
                  <div className="mb-1"><strong>Page:</strong> {currentPage}</div>
                  <div><strong>System:</strong> {browserInfo ? JSON.parse(browserInfo).userAgent.substring(0, 60) + '...' : 'Unknown'}</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ErrorReportWidget;