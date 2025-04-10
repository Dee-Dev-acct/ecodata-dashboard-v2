import React from 'react';
import { Users, Award, ThumbsUp, Info } from 'lucide-react';
import { Link } from 'wouter';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ValueProposition = () => {
  return (
    <section className="py-6 bg-[#F4F1DE]/50 dark:bg-[#264653]/90 border-t border-b border-[#2A9D8F]/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/partners" className="flex items-center gap-2 text-[#264653] dark:text-[#F4F1DE] cursor-pointer group">
                  <Users className="w-5 h-5 text-[#2A9D8F] group-hover:scale-110 transition-transform" />
                  <span className="font-medium group-hover:underline">Trusted by 20+ organisations across the UK</span>
                  <Info className="w-3.5 h-3.5 text-[#E9C46A] opacity-70" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View our partners and case studies</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/about" className="flex items-center gap-2 text-[#264653] dark:text-[#F4F1DE] cursor-pointer group">
                  <Award className="w-5 h-5 text-[#2A9D8F] group-hover:scale-110 transition-transform" />
                  <span className="font-medium group-hover:underline">CIC-certified social enterprise</span>
                  <Info className="w-3.5 h-3.5 text-[#E9C46A] opacity-70" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn about our social mission</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/about" className="flex items-center gap-2 text-[#264653] dark:text-[#F4F1DE] cursor-pointer group">
                  <ThumbsUp className="w-5 h-5 text-[#2A9D8F] group-hover:scale-110 transition-transform" />
                  <span className="font-medium group-hover:underline">More than 10 years of data expertise</span>
                  <Info className="w-3.5 h-3.5 text-[#E9C46A] opacity-70" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Discover our team's expertise</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;