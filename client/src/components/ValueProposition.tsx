import React from 'react';
import { Users, Award, ThumbsUp } from 'lucide-react';

const ValueProposition = () => {
  return (
    <section className="py-6 bg-[#F4F1DE]/50 dark:bg-[#264653]/90 border-t border-b border-[#2A9D8F]/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-center">
          <div className="flex items-center gap-2 text-[#264653] dark:text-[#F4F1DE]">
            <Users className="w-5 h-5 text-[#2A9D8F]" />
            <span className="font-medium">Trusted by 20+ organisations across the UK</span>
          </div>
          
          <div className="flex items-center gap-2 text-[#264653] dark:text-[#F4F1DE]">
            <Award className="w-5 h-5 text-[#2A9D8F]" />
            <span className="font-medium">CIC-certified social enterprise</span>
          </div>
          
          <div className="flex items-center gap-2 text-[#264653] dark:text-[#F4F1DE]">
            <ThumbsUp className="w-5 h-5 text-[#2A9D8F]" />
            <span className="font-medium">5+ years of data expertise</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;