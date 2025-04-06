import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Publication } from '@shared/schema';
import { Loader2, ArrowLeft, Calendar, Users, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useRoute } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const PublicationDetail: React.FC = () => {
  // Extract the id from the URL
  const [, params] = useRoute<{ id: string }>('/publications/:id');
  const id = params?.id;

  const { data: publication, isLoading, error } = useQuery<Publication>({
    queryKey: [`/api/publications/${id}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Publication</h2>
          <p className="text-muted-foreground mb-4">The publication could not be found or has been removed.</p>
          <Button asChild>
            <Link href="/publications">Back to Publications</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = publication.publicationDate
    ? new Date(publication.publicationDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="outline"
        size="sm"
        className="mb-8"
        asChild
      >
        <Link href="/publications" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Publications
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="text-sm capitalize">
            {publication.type}
          </Badge>
          {publication.categories?.map((category) => (
            <Badge key={category} variant="secondary" className="text-sm">
              {category}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-6">{publication.title}</h1>

        <div className="flex flex-wrap items-center text-muted-foreground mb-8 gap-y-2 gap-x-6">
          {formattedDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          )}

          {publication.authors && publication.authors.length > 0 && (
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>{publication.authors.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          {publication.fileUrl && (
            <Button asChild>
              <a 
                href={publication.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Publication
              </a>
            </Button>
          )}

          {publication.externalUrl && (
            <Button variant="outline" asChild>
              <a 
                href={publication.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Original Source
              </a>
            </Button>
          )}
        </div>

        <div className="bg-card p-8 rounded-lg border mb-10">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <p className="text-muted-foreground whitespace-pre-line">
            {publication.summary}
          </p>
        </div>

        <Separator className="my-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">•</span>
                <span>This publication examines the intersection of technology, data analytics, and environmental sustainability.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">•</span>
                <span>It provides frameworks and methodologies for measuring environmental impact through data-driven approaches.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">•</span>
                <span>The research highlights successful case studies and best practices in the field.</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Related Publications</h2>
            <p className="text-muted-foreground mb-4">
              Browse more of our publications related to this topic:
            </p>
            <div className="space-y-2">
              {publication.categories?.map(category => (
                <Button 
                  key={category}
                  variant="outline"
                  size="sm"
                  className="mr-2 mb-2"
                  asChild
                >
                  <Link href={`/publications?category=${category}`}>
                    {category}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicationDetail;