import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CaseStudy } from "@shared/schema";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy, index }) => {
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full overflow-hidden">
        {caseStudy.coverImage && (
          <div className="h-48 relative overflow-hidden">
            <img 
              src={caseStudy.coverImage} 
              alt={caseStudy.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <Badge 
              className="absolute top-3 right-3 bg-primary text-white"
              variant="default"
            >
              {caseStudy.impactType}
            </Badge>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <span className="capitalize">{caseStudy.sector}</span>
            <span className="mx-2">•</span>
            <span>
              {caseStudy.publishDate 
                ? new Date(caseStudy.publishDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short'
                  }) 
                : 'Unpublished'}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">{caseStudy.title}</h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {caseStudy.summary}
          </p>
          
          <Button 
            variant="link" 
            className="px-0 font-medium"
            asChild
          >
            <Link href={`/case-studies/${caseStudy.slug}`} className="flex items-center">
              Read Case Study
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CaseStudyCard;