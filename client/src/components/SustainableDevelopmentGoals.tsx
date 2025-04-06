import React from 'react';
import { motion } from 'framer-motion';

interface SDGItemProps {
  color: string;
  number: number;
  title: string;
  description: string;
  alignments: string[];
}

const SDGItem: React.FC<SDGItemProps> = ({ color, number, title, description, alignments }) => {
  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-3">
        <div 
          className={`w-12 h-12 flex items-center justify-center text-white font-bold rounded-lg mr-3 ${color}`}
        >
          {number}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-300 mb-3">{description}</p>
      <div className="mt-auto">
        <h4 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">How ECODATA aligns:</h4>
        <ul className="space-y-2">
          {alignments.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-4 h-4 mt-1 mr-2 bg-primary rounded-full"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
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
      alignments: [
        "Smart urban planning with data",
        "Environmental monitoring in cities",
        "Supporting local councils with digital insights"
      ]
    },
    {
      color: "bg-yellow-500",
      number: 12,
      title: "Responsible Consumption and Production",
      description: "Ensure sustainable consumption and production patterns.",
      alignments: [
        "Data on resource efficiency",
        "Waste tracking or environmental footprint tools",
        "Tech for sustainable decision-making in organizations"
      ]
    },
    {
      color: "bg-green-500",
      number: 13,
      title: "Climate Action",
      description: "Take urgent action to combat climate change and its impacts.",
      alignments: [
        "Impact dashboards for emissions",
        "Environmental data collection and analysis",
        "Community awareness and carbon literacy initiatives"
      ]
    },
    {
      color: "bg-blue-500",
      number: 17,
      title: "Partnerships for the Goals",
      description: "Strengthen global partnerships to support sustainable development.",
      alignments: [
        "Working with councils, NGOs, universities",
        "Contributing to open data ecosystems",
        "Enabling collaboration through dashboards or joint research"
      ]
    }
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">UN Sustainable Development Goals</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            ECODATA CIC is proud to contribute to the United Nations Sustainable Development Goals.
            Our work directly supports these global initiatives for a more sustainable future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sdgData.map((sdg, index) => (
            <SDGItem key={index} {...sdg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainableDevelopmentGoals;