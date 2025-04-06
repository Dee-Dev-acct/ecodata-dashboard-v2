import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

interface SDGItemProps {
  color: string;
  number: number;
}

const SDGItem: React.FC<SDGItemProps> = ({ color, number }) => {
  return (
    <motion.div 
      className={`${color} w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg shadow-md`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <span className="text-white font-bold text-lg md:text-xl">SDG {number}</span>
    </motion.div>
  );
};

const SustainableDevelopmentGoalsHome: React.FC = () => {
  const sdgData = [
    { color: "bg-red-500", number: 11 },
    { color: "bg-yellow-500", number: 12 },
    { color: "bg-green-500", number: 13 },
    { color: "bg-blue-500", number: 17 }
  ];

  return (
    <section className="py-12 bg-slate-900 text-white">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold">Supporting UN Sustainable Development Goals</h2>
        </motion.div>

        <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap">
          {sdgData.map((sdg, index) => (
            <SDGItem key={index} {...sdg} />
          ))}
        </div>
        
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/impact" onClick={() => { sessionStorage.setItem('referrer', 'home_sdg'); }}>
            <span className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
              Learn more about our impact and SDG contributions
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SustainableDevelopmentGoalsHome;