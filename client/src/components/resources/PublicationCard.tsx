import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Book, Download, ExternalLink, FileText, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Publication } from "@shared/schema";
import { Link } from "wouter";

interface PublicationCardProps {
  publication: Publication;
  index: number;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication, index }) => {
  // Animation variants with delay based on index
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  // Type icon mapping
  const typeIcons: Record<string, React.ReactNode> = {
    'research paper': <Book className="h-5 w-5" />,
    'white paper': <FileText className="h-5 w-5" />,
    'report': <FileText className="h-5 w-5" />,
    'policy': <Globe className="h-5 w-5" />,
    'article': <FileText className="h-5 w-5" />
  };

  // Default icon if type doesn't match
  const defaultIcon = <FileText className="h-5 w-5" />;
  
  // Get publication year from publicationDate or createdAt
  const getPublicationYear = () => {
    const date = publication.publicationDate || publication.createdAt;
    return date ? new Date(date).getFullYear().toString() : 'Unknown';
  };
  
  // Get first category as the main topic
  const getMainTopic = () => {
    return publication.categories && publication.categories.length > 0 
      ? publication.categories[0] 
      : '';
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full flex flex-col">
        <CardContent className="p-6 flex-grow">
          <div className="flex justify-between items-start gap-4 mb-4">
            <Badge variant="outline" className="capitalize px-2 py-1 text-sm">
              {publication.type}
            </Badge>
            <span className="text-sm font-medium">{getPublicationYear()}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">{publication.title}</h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {publication.summary}
          </p>
          
          {getMainTopic() && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="capitalize">{getMainTopic()}</span>
            </div>
          )}
          
          {publication.authors && publication.authors.length > 0 && (
            <div className="flex items-center mt-3 text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {publication.authors.slice(0, 2).join(", ")}
                {publication.authors.length > 2 ? ` +${publication.authors.length - 2} more` : ""}
              </span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-6 pt-2 border-t">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center text-muted-foreground">
              {typeIcons[publication.type.toLowerCase()] || defaultIcon}
              <span className="ml-2 text-sm">ECODATA CIC</span>
            </div>
            
            <div className="flex items-center gap-2">
              {publication.fileUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={publication.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Download size={14} className="mr-1" />
                    PDF
                  </a>
                </Button>
              )}
              
              {publication.externalUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={publication.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Source
                  </a>
                </Button>
              )}
              
              {/* Link to publication detail page */}
              <Button 
                variant="link" 
                size="sm"
                className="px-2 font-medium"
                asChild
              >
                <Link href={`/publications/${publication.id}`} className="flex items-center">
                  View
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PublicationCard;