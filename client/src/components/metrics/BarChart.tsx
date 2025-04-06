import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  title?: string;
  subtitle?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  color = '#2A9D8F',
  title,
  subtitle,
  valuePrefix = '',
  valueSuffix = '',
  className = ''
}) => {
  return (
    <motion.div 
      className={`bg-card rounded-xl p-4 shadow-sm border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
      {subtitle && <p className="text-muted-foreground text-sm mb-4">{subtitle}</p>}
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              tickFormatter={(value) => `${valuePrefix}${value}${valueSuffix}`}
            />
            <Tooltip 
              formatter={(value) => [`${valuePrefix}${value}${valueSuffix}`, '']}
              contentStyle={{ 
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            />
            <Bar 
              dataKey="value" 
              fill={color} 
              radius={[4, 4, 0, 0]}
              animationDuration={2000}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BarChart;