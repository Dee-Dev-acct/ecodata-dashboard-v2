import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { FAQ } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare } from "lucide-react";

interface FAQAccordionProps {
  faqs: FAQ[];
  category?: string;
}

// Define related pages for categories
const categoryRelations = {
  'General': '/about',
  'Services': '/services',
  'Impact': '/impact',
  'Community': '/impact',
  'Digital Literacy': '/services/digital-literacy',
  'Data Analytics': '/services/data-analytics',
  'Decision Dashboards': '/services/decision-dashboards',
  'Open Data': '/services/open-data',
  'Community Innovation': '/services/community-innovation',
  'Research': '/resources/publications',
  'Partnerships': '/contact',
  'Involvement': '/contact',
  'Donations': '/donate'
};

// Helper function to parse and render answer text with links
const renderAnswerWithLinks = (answer: string) => {
  // Regular expression to find links in format [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  // Find all matches and build parts array
  while ((match = linkRegex.exec(answer)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(answer.substring(lastIndex, match.index));
    }
    
    // Add the link component
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <Link key={match.index} to={linkUrl} className="text-primary hover:underline">
        {linkText}
      </Link>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add the remaining text
  if (lastIndex < answer.length) {
    parts.push(answer.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : answer;
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs, category }) => {
  const filteredFAQs = category 
    ? faqs.filter(faq => faq.category === category) 
    : faqs;
  
  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    if (a.category === b.category) {
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    }
    return a.category.localeCompare(b.category);
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Group FAQs by category if no specific category is provided
  const groupedFAQs = sortedFAQs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  // Render related links and action buttons
  const renderRelatedLinks = (category: string) => {
    const relatedPage = categoryRelations[category as keyof typeof categoryRelations];
    
    if (!relatedPage) return null;
    
    return (
      <div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
        <span className="text-muted-foreground">Related:</span>
        <Link to={relatedPage} className="inline-flex items-center text-primary hover:underline">
          Learn more about {category}
          <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
    );
  };

  const renderActionButtons = () => (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button size="sm" variant="outline" className="flex items-center" asChild>
        <Link to="/contact">
          <MessageSquare size={16} className="mr-2" />
          Contact Us
        </Link>
      </Button>
      <Button size="sm" variant="outline" className="flex items-center" asChild>
        <Link to="/book-appointment">
          <Calendar size={16} className="mr-2" />
          Book Appointment
        </Link>
      </Button>
    </div>
  );

  if (category) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Accordion type="single" collapsible className="w-full">
          {sortedFAQs.map((faq, index) => (
            <motion.div key={faq.id} variants={itemVariants}>
              <AccordionItem 
                id={`faq-${faq.id}`}
                value={`faq-${faq.id}`} 
                className="border-b border-border scroll-mt-24"
              >
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground mb-2">{renderAnswerWithLinks(faq.answer)}</div>
                  {renderRelatedLinks(faq.category)}
                  {index === sortedFAQs.length - 1 && renderActionButtons()}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {Object.entries(groupedFAQs).map(([categoryName, categoryFAQs]) => (
        <div key={categoryName}>
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoryName}</h3>
          <Accordion type="single" collapsible className="w-full">
            {categoryFAQs.map((faq, index) => (
              <motion.div key={faq.id} variants={itemVariants}>
                <AccordionItem 
                  id={`faq-${faq.id}`}
                  value={`faq-${faq.id}`} 
                  className="border-b border-border scroll-mt-24"
                >
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-muted-foreground mb-2">{renderAnswerWithLinks(faq.answer)}</div>
                    {renderRelatedLinks(faq.category)}
                    {index === categoryFAQs.length - 1 && renderActionButtons()}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      ))}
    </motion.div>
  );
};

export default FAQAccordion;