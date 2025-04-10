import React, { useState, useEffect } from 'react';
import { Calendar, ArrowUpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Show the CTA after 3 seconds and when scrolled down at least 300px
  useEffect(() => {
    if (isDismissed) return;
    
    const timer = setTimeout(() => {
      const handleScroll = () => {
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial position
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isDismissed]);
  
  const scrollToBookAppointment = () => {
    document.getElementById('book-appointment')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };
  
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Detect scroll position for back to top button
  useEffect(() => {
    const handleScrollForTopButton = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    
    window.addEventListener('scroll', handleScrollForTopButton);
    handleScrollForTopButton(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScrollForTopButton);
    };
  }, []);
  
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-2 rounded-full bg-[#264653] text-white shadow-lg hover:bg-opacity-90 transition-all"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <ArrowUpCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Book Appointment CTA */}
      <AnimatePresence>
        {isVisible && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="bg-[#2A9D8F] text-white rounded-lg shadow-lg p-4 pr-8 cursor-pointer relative"
            onClick={scrollToBookAppointment}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button 
              onClick={handleDismiss}
              className="absolute top-1 right-1 p-1 rounded-full hover:bg-white/20"
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 animate-pulse" />
              <div>
                <div className="font-medium">Book Your Consultation</div>
                <div className="text-xs text-white/90">First session is free!</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingCTA;