import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Publication } from '@shared/schema';
import { Loader2, FileText, Filter } from 'lucide-react';
import PublicationCard from '@/components/resources/PublicationCard';
import { motion } from 'framer-motion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Publications: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  
  const { data: publications, isLoading, error } = useQuery<Publication[]>({
    queryKey: ['/api/publications'],
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
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Publications</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Publications Found</h2>
          <p className="text-muted-foreground">Please check back later for updates.</p>
        </div>
      </div>
    );
  }

  // Extract unique values for filters
  const typeValues: string[] = publications.map(pub => pub.type || '');
  const uniqueTypes = Array.from(new Set(typeValues));
  const types = ['all', ...uniqueTypes];
  
  // Get years from publicationDate if available, or fallback to createdAt
  const yearValues: string[] = publications.map(pub => {
    const date = pub.publicationDate || pub.createdAt;
    return date ? new Date(date).getFullYear().toString() : 'Unknown';
  });
  const uniqueYears = Array.from(new Set(yearValues));
  const years = ['all', ...uniqueYears].sort((a, b) => b.localeCompare(a));
  
  // Use categories as topics
  const topicValues: string[] = publications
    .flatMap(pub => pub.categories || [])
    .filter(Boolean) as string[];
  const uniqueTopics = Array.from(new Set(topicValues));
  const topics = ['all', ...uniqueTopics];

  // Apply filters
  const filteredPublications = publications.filter(pub => {
    const matchesType = typeFilter === 'all' || pub.type === typeFilter;
    
    const pubYear = pub.publicationDate || pub.createdAt;
    const yearString = pubYear ? new Date(pubYear).getFullYear().toString() : 'Unknown';
    const matchesYear = yearFilter === 'all' || yearString === yearFilter;
    
    const matchesTopic = topicFilter === 'all' || 
      (pub.categories && pub.categories.includes(topicFilter));
      
    return matchesType && matchesYear && matchesTopic;
  });

  // Reset all filters
  const resetFilters = () => {
    setTypeFilter('all');
    setYearFilter('all');
    setTopicFilter('all');
  };

  // Check if any filters are applied
  const hasActiveFilters = typeFilter !== 'all' || yearFilter !== 'all' || topicFilter !== 'all';

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Publications</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our research papers, white papers, and policy briefs that share insights 
          on sustainability, data ethics, and technology for social good.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto flex-grow md:flex-grow-0">
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic} className="capitalize">
                    {topic === 'all' ? 'All Topics' : topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="self-end"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 flex flex-wrap gap-2 items-center"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              Type: {typeFilter}
            </Badge>
          )}
          {yearFilter !== 'all' && (
            <Badge variant="secondary">
              Year: {yearFilter}
            </Badge>
          )}
          {topicFilter !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              Topic: {topicFilter}
            </Badge>
          )}
        </motion.div>
      )}

      {filteredPublications.length === 0 ? (
        <div className="bg-muted p-8 text-center rounded-lg">
          <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No publications match your filters</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filter criteria or clearing all filters.</p>
          <Button onClick={resetFilters}>Clear All Filters</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPublications.map((publication, index) => (
              <PublicationCard 
                key={publication.id} 
                publication={publication} 
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      <Separator className="my-16" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">Research Approach</h2>
          <p className="text-muted-foreground">
            Our publications represent original research conducted with rigorous methodologies
            and ethical considerations. We collaborate with academic institutions, industry partners,
            and community organizations to ensure diverse perspectives and practical applications.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Open Knowledge</h2>
          <p className="text-muted-foreground">
            We believe in the power of open knowledge and aim to make our research accessible to all.
            Our publications provide valuable insights for practitioners, policymakers, researchers,
            and anyone interested in the intersection of technology, sustainability, and social impact.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Custom Research</h2>
          <p className="text-muted-foreground">
            Looking for research on specific topics related to our areas of expertise?
            We offer custom research services and are open to collaboration opportunities.
            Contact us to discuss how we can help advance knowledge in your field of interest.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Publications;