import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  title?: string;
  subtitle?: string;
  className?: string;
  centerLabel?: string;
  innerRadius?: number;
  outerRadius?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  className = '',
  centerLabel,
  innerRadius = 60,
  outerRadius = 80
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
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              dataKey="value"
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{ 
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            />
            {centerLabel && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-semibold"
                fill="#374151"
              >
                {centerLabel}
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center text-sm">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DonutChart;