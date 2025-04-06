import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FAQ } from '@shared/schema';
import { Loader2, Search, HelpCircle, Mail, Calendar, Phone, ArrowRight, Info, Book, BadgeHelp, FileQuestion, Lightbulb } from 'lucide-react';
import FAQAccordion from '@/components/resources/FAQAccordion';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickFeedbackButton } from '@/components/FeedbackDialog';

// Define category icons for visual representation
const categoryIcons: Record<string, React.ReactNode> = {
  'General': <Info className="w-5 h-5" />,
  'Services': <Lightbulb className="w-5 h-5" />,
  'Impact': <ArrowRight className="w-5 h-5" />,
  'Involvement': <Book className="w-5 h-5" />,
  'Partnerships': <Phone className="w-5 h-5" />,
  'Research': <FileQuestion className="w-5 h-5" />,
  'Community': <BadgeHelp className="w-5 h-5" />,
};

// Define suggested questions for each major section
const popularQuestions = [
  {
    id: 1,
    question: "What is ECODATA CIC and what does it do?",
    category: "General",
    link: "#faq-1"
  },
  {
    id: 5,
    question: "What services does ECODATA CIC offer?",
    category: "Services",
    link: "#faq-5"
  },
  {
    id: 7,
    question: "What impact has ECODATA CIC achieved so far?",
    category: "Impact",
    link: "#faq-7" 
  },
  {
    id: 6,
    question: "How can my organisation partner with ECODATA CIC?",
    category: "Partnerships",
    link: "#faq-6"
  },
  {
    id: 3,
    question: "Do you offer volunteer or internship opportunities?",
    category: "Involvement",
    link: "#faq-3"
  }
];

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

  const scrollToFAQ = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
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

  // Extract unique categories and sort them alphabetically
  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category))).sort()];

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

      {/* Popular Questions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-5xl mx-auto mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Popular Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularQuestions.map((q) => (
            <Card key={q.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => scrollToFAQ(`faq-${q.id}`)}>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-primary">
                    {categoryIcons[q.category] || <HelpCircle className="w-5 h-5" />}
                  </div>
                  <CardTitle className="text-base font-medium">{q.question}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <CardDescription className="mt-2 flex items-center text-primary">
                  View answer <ArrowRight size={14} className="ml-1" />
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
              <span className="flex items-center gap-2">
                {category !== 'all' && categoryIcons[category]}
                {category === 'all' ? 'All Categories' : category}
              </span>
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

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-muted p-8 rounded-lg text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Have Technical Questions?</h2>
          <p className="mb-6 text-muted-foreground">
            Book a call with our technical team to discuss your specific data requirements or project needs.
          </p>
          <Button className="flex items-center" asChild>
            <Link to="/book-appointment">
              <Calendar size={18} className="mr-2" />
              Book Appointment
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-muted p-8 rounded-lg text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="mb-6 text-muted-foreground">
            If you couldn't find the answer you were looking for, please contact us directly and we'll be happy to help.
          </p>
          <Button className="flex items-center" asChild>
            <Link to="/contact">
              <Mail size={18} className="mr-2" />
              Contact Us
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="flex justify-center mt-12">
        <QuickFeedbackButton />
      </div>
    </div>
  );
};

export default FAQs;