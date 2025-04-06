import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Download, FileText, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Publication } from "@shared/schema";

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
    'research': <Book className="h-5 w-5" />,
    'whitepaper': <FileText className="h-5 w-5" />,
    'report': <FileText className="h-5 w-5" />,
    'policy': <Globe className="h-5 w-5" />,
    'article': <FileText className="h-5 w-5" />
  };

  // Default icon if type doesn't match
  const defaultIcon = <FileText className="h-5 w-5" />;

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
            <span className="text-sm font-medium">{publication.year}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">{publication.title}</h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {publication.summary}
          </p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="capitalize">{publication.topic}</span>
          </div>
          
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
              <span className="ml-2 text-sm">{publication.organization}</span>
            </div>
            
            {publication.fileUrl && (
              <Button 
                variant="outline" 
                size="sm"
                className="ml-auto"
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
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PublicationCard;