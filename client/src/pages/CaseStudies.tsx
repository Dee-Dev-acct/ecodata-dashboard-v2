import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CaseStudy } from '@shared/schema';
import { Loader2, Home } from 'lucide-react';
import CaseStudyCard from '@/components/resources/CaseStudyCard';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'wouter';

const CaseStudies: React.FC = () => {
  const [currentFilter, setCurrentFilter] = React.useState<string>('all');
  
  const { data: caseStudies, isLoading, error } = useQuery<CaseStudy[]>({
    queryKey: ['/api/case-studies'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Case Studies</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Case Studies Found</h2>
          <p className="text-muted-foreground">Please check back later for updates.</p>
        </div>
      </div>
    );
  }

  // Get all unique impact types for filtering
  const impactTypes = ['all', ...new Set(caseStudies.map(cs => cs.impactType.toLowerCase()))];

  // Filter case studies based on current selection
  const filteredCaseStudies = currentFilter === 'all'
    ? caseStudies
    : caseStudies.filter(cs => cs.impactType.toLowerCase() === currentFilter);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="relative mb-2">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
          <Home className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our impact through real-world projects that demonstrate our commitment to environmental 
          and social change through innovative data solutions.
        </p>
      </motion.div>

      <Tabs defaultValue="all" className="w-full mb-12">
        <TabsList className="flex justify-center mb-8">
          {impactTypes.map((type) => (
            <TabsTrigger 
              key={type} 
              value={type}
              onClick={() => setCurrentFilter(type)}
              className="capitalize"
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={currentFilter} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard 
                key={caseStudy.id} 
                caseStudy={caseStudy} 
                index={index}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-muted p-8 rounded-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Our Approach to Creating Impact</h2>
        <p className="mb-4">
          At ECODATA CIC, we believe in the power of data and technology to drive positive environmental and social change.
          Our case studies showcase real-world examples of how we've worked with organizations across sectors to create
          measurable impact through:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Data-driven approaches to environmental challenges</li>
          <li>Sustainable technology implementations that reduce carbon footprints</li>
          <li>Community engagement and digital inclusion initiatives</li>
          <li>Innovative research and development with practical applications</li>
        </ul>
        <p>
          Each case study demonstrates our commitment to generating sustainable outcomes that benefit both people and planet.
        </p>
      </motion.div>
    </div>
  );
};

export default CaseStudies;