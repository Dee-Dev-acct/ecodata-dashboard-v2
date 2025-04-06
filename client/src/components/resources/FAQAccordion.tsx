import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { FAQ } from "@shared/schema";

interface FAQAccordionProps {
  faqs: FAQ[];
  category?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs, category }) => {
  const filteredFAQs = category 
    ? faqs.filter(faq => faq.category === category) 
    : faqs;
  
  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    if (a.category === b.category) {
      return (a.order || 0) - (b.order || 0);
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
              <AccordionItem value={`faq-${faq.id}`} className="border-b border-border">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
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
                <AccordionItem value={`faq-${faq.id}`} className="border-b border-border">
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
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