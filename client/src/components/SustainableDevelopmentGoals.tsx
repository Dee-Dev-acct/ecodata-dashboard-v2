import React from 'react';
import { motion } from 'framer-motion';

interface SDGItemProps {
  color: string;
  number: number;
  title: string;
  description: string;
  alignment: string;
}

const SDGItem: React.FC<SDGItemProps> = ({ color, number, title, description, alignment }) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div 
        className={`${color} w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-lg shadow-md mx-auto md:mx-0`}
      >
        <span className="text-white font-bold text-xl">SDG {number}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-3">{description}</p>
        <div>
          <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Our Alignment:</h4>
          <p className="text-slate-700 dark:text-slate-200">{alignment}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SustainableDevelopmentGoals: React.FC = () => {
  const sdgData = [
    {
      color: "bg-red-500",
      number: 11,
      title: "Sustainable Cities and Communities",
      description: "Make cities and human settlements inclusive, safe, resilient, and sustainable.",
      alignment: "Through our urban data analytics and community dashboards, we support local authorities and community groups to make evidence-based decisions for sustainable urban planning."
    },
    {
      color: "bg-yellow-500",
      number: 12,
      title: "Responsible Consumption and Production",
      description: "Ensure sustainable consumption and production patterns.",
      alignment: "Our data visualization tools help organizations analyze resource efficiency and environmental impact, supporting the transition to sustainable practices and circular economy principles."
    },
    {
      color: "bg-green-500",
      number: 13,
      title: "Climate Action",
      description: "Take urgent action to combat climate change and its impacts.",
      alignment: "We develop impact measurement frameworks and dashboards that track emissions reductions, helping organizations understand their environmental footprint and take meaningful climate action."
    },
    {
      color: "bg-blue-500",
      number: 17,
      title: "Partnerships for the Goals",
      description: "Strengthen the means of implementation and revitalize the global partnership for sustainable development.",
      alignment: "ECODATA CIC actively partners with local councils, universities, NGOs, and community organizations, contributing to open data initiatives that advance sustainable development goals."
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="mb-12 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Supporting UN Sustainable Development Goals</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            ECODATA CIC aligns its work with the United Nations Sustainable Development Goals,
            focusing particularly on these key areas where our digital literacy and data expertise
            can make the most significant impact.
          </p>
        </motion.div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {sdgData.map((sdg, index) => (
            <SDGItem key={index} {...sdg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainableDevelopmentGoals;