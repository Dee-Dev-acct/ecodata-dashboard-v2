import React from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { CaseStudy } from '@shared/schema';
import { Loader2, Building, Map, Calendar, ArrowLeft, FileText, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';

const CaseStudyDetail: React.FC = () => {
  const [, params] = useRoute('/case-studies/:slug');
  const slug = params?.slug;
  
  const { data: caseStudy, isLoading, error } = useQuery<CaseStudy>({
    queryKey: [`/api/case-studies/${slug}`],
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Case Study Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested case study could not be found.</p>
          <Button asChild>
            <Link href="/case-studies">Back to Case Studies</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-8"
        asChild
      >
        <Link href="/case-studies" className="flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Case Studies
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-bold">{caseStudy.title}</h1>
              <Badge className="px-3 py-1.5 text-base bg-primary text-white">
                {caseStudy.impactType}
              </Badge>
            </div>

            {caseStudy.coverImage && (
              <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                <img 
                  src={caseStudy.coverImage} 
                  alt={caseStudy.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
              <ReactMarkdown>{caseStudy.content}</ReactMarkdown>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building size={20} className="mr-3 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-muted-foreground">{caseStudy.sector}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Map size={20} className="mr-3 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{caseStudy.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={20} className="mr-3 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {caseStudy.publishDate 
                        ? new Date(caseStudy.publishDate).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long'
                          }) 
                        : 'Unpublished'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText size={20} className="mr-3 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Sector</p>
                    <p className="text-muted-foreground">{caseStudy.sector}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Users size={20} className="mr-2 text-primary" />
                <h3 className="text-xl font-semibold">Impact Category</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="px-3 py-1 capitalize">
                  {caseStudy.impactType}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 capitalize">
                  {caseStudy.sector}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {caseStudy.stats && Object.keys(caseStudy.stats).length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <BarChart size={20} className="mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Key Metrics</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(caseStudy.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1')
                           .replace(/^./, str => str.toUpperCase())
                           .replace(/([A-Z])/g, (match) => ` ${match.toLowerCase()}`)}
                      </p>
                      <p className="text-primary font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;