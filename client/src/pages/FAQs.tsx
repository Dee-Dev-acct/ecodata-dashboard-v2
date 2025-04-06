import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FAQ } from '@shared/schema';
import { Loader2, Search, HelpCircle, Mail } from 'lucide-react';
import FAQAccordion from '@/components/resources/FAQAccordion';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FAQs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { data: faqs, isLoading, error } = useQuery<FAQ[]>({
    queryKey: ['/api/faqs'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading FAQs</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No FAQs Found</h2>
          <p className="text-muted-foreground">Please check back later for updates.</p>
        </div>
      </div>
    );
  }

  // Extract unique categories
  const categories = ['all', ...new Set(faqs.map(faq => faq.category))];

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our services, technology approach, and impact.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-lg mx-auto mb-12"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 py-6 text-lg"
          />
        </div>
      </motion.div>

      <Tabs 
        defaultValue="all" 
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="max-w-4xl mx-auto mb-16"
      >
        <TabsList className="flex justify-center mb-8 flex-wrap">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize"
            >
              {category === 'all' ? 'All Categories' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          {filteredFAQs.length > 0 ? (
            <FAQAccordion 
              faqs={filteredFAQs} 
              category={activeCategory === 'all' ? undefined : activeCategory}
            />
          ) : (
            <div className="bg-muted rounded-lg p-8 text-center">
              <HelpCircle size={48} className="mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No matching questions found</h3>
              <p className="mb-4 text-muted-foreground">
                {searchQuery 
                  ? `No FAQs match your search for "${searchQuery}".` 
                  : "No FAQs found in this category."}
              </p>
              <div className="flex justify-center gap-4">
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
                {activeCategory !== 'all' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveCategory('all')}
                  >
                    View All FAQs
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-2xl mx-auto bg-muted p-8 rounded-lg text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
        <p className="mb-6 text-muted-foreground">
          If you couldn't find the answer you were looking for, please contact us directly and we'll be happy to help.
        </p>
        <Button className="flex items-center" asChild>
          <a href="/contact">
            <Mail size={18} className="mr-2" />
            Contact Us
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default FAQs;