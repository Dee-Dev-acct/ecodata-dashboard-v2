import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

interface SDGItemProps {
  color: string;
  number: number;
  title: string;
  description: string;
}

const SDGItem: React.FC<SDGItemProps> = ({ color, number, title, description }) => {
  return (
    <motion.div 
      className="flex items-start space-x-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div 
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-white font-bold rounded-lg ${color}`}
      >
        {number}
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

const SustainableDevelopmentGoalsHome: React.FC = () => {
  const sdgData = [
    {
      color: "bg-red-500",
      number: 11,
      title: "Sustainable Cities and Communities",
      description: "Smart urban planning with data and environmental monitoring in cities"
    },
    {
      color: "bg-yellow-500",
      number: 12,
      title: "Responsible Consumption and Production",
      description: "Data on resource efficiency and tech for sustainable decision-making"
    },
    {
      color: "bg-green-500",
      number: 13,
      title: "Climate Action",
      description: "Impact dashboards for emissions and environmental data collection"
    },
    {
      color: "bg-blue-500",
      number: 17,
      title: "Partnerships for the Goals",
      description: "Working with councils, NGOs, universities and contributing to open data"
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="mb-10 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Supporting UN Sustainable Development Goals</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            ECODATA CIC is committed to the United Nations Sustainable Development Goals,
            aligning our work with these global initiatives for a better, more sustainable future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {sdgData.map((sdg, index) => (
            <SDGItem key={index} {...sdg} />
          ))}
        </div>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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