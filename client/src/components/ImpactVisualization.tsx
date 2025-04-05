import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImpactMetric } from '@shared/schema';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Historical data for time series visualization
// In a real application, this would come from the API
const historicalData = {
  carbon: [
    { year: '2020', value: 85 },
    { year: '2021', value: 147 },
    { year: '2022', value: 189 },
    { year: '2023', value: 218 },
    { year: '2024', value: 247 },
  ],
  community: [
    { year: '2020', value: 650 },
    { year: '2021', value: 1420 },
    { year: '2022', value: 2100 },
    { year: '2023', value: 2800 },
    { year: '2024', value: 3500 },
  ],
  efficiency: [
    { year: '2020', value: 12 },
    { year: '2021', value: 18 },
    { year: '2022', value: 23 },
    { year: '2023', value: 27 },
    { year: '2024', value: 32 },
  ]
};

// Comparative industry data
// In a real application, this would come from the API
const industryComparisonData = [
  { name: 'ECODATA', value: 247, fill: '#2A9D8F' },
  { name: 'Industry Average', value: 156, fill: '#E9C46A' },
  { name: 'Top Performer', value: 320, fill: '#457B9D' },
];

// Color mapping for categories
const categoryColors = {
  environmental: '#2A9D8F',
  social: '#457B9D',
  efficiency: '#4CAF50'
};

// Converting data for visualization
const prepareMetricsForChart = (metrics: ImpactMetric[]) => {
  return metrics.map(metric => {
    // Extract numeric value from the string (e.g., "247 tonnes" -> 247)
    const numericValue = parseInt(metric.value.replace(/[^0-9]/g, ''));
    
    return {
      name: metric.title,
      value: isNaN(numericValue) ? 0 : numericValue,
      category: metric.category,
      fill: categoryColors[metric.category as keyof typeof categoryColors] || '#2A9D8F'
    };
  });
};

const ImpactVisualization = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('carbon');
  
  const { data: metrics = [], isLoading, error } = useQuery<ImpactMetric[]>({
    queryKey: ['/api/impact-metrics'],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A9D8F]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load impact metrics. Please try again later.
      </div>
    );
  }
  
  const chartData = prepareMetricsForChart(metrics);
  
  // Select time series data based on the selected metric
  const getTimeSeriesData = () => {
    switch (selectedMetric) {
      case 'carbon':
        return historicalData.carbon;
      case 'community':
        return historicalData.community;
      case 'efficiency':
        return historicalData.efficiency;
      default:
        return historicalData.carbon;
    }
  };
  
  // Get the appropriate title for the time series chart
  const getTimeSeriesTitle = () => {
    switch (selectedMetric) {
      case 'carbon':
        return 'Carbon Reduction Progress';
      case 'community':
        return 'Community Engagement Growth';
      case 'efficiency':
        return 'Resource Efficiency Improvements';
      default:
        return 'Impact Progress';
    }
  };
  
  // Get the appropriate unit for the time series chart
  const getTimeSeriesUnit = () => {
    switch (selectedMetric) {
      case 'carbon':
        return 'tonnes';
      case 'community':
        return 'people';
      case 'efficiency':
        return '%';
      default:
        return 'units';
    }
  };
  
  return (
    <div className="py-10">
      <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Impact Overview</TabsTrigger>
          <TabsTrigger value="timeline">Historical Progress</TabsTrigger>
          <TabsTrigger value="comparison">Industry Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Impact Metrics Distribution</CardTitle>
              <CardDescription>
                Visual representation of our key impact metrics across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        const metric = metrics.find(m => m.title === props.payload.name);
                        return [metric?.value || value, 'Value'];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Impact Value">
                      {
                        chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{getTimeSeriesTitle()}</CardTitle>
              <CardDescription>
                Year-on-year growth and improvement
              </CardDescription>
              <div className="pt-2">
                <Select 
                  value={selectedMetric} 
                  onValueChange={setSelectedMetric}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carbon">Carbon Reduction</SelectItem>
                    <SelectItem value="community">Community Engagement</SelectItem>
                    <SelectItem value="efficiency">Resource Efficiency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getTimeSeriesData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis unit={selectedMetric === 'efficiency' ? '%' : ''} />
                    <Tooltip 
                      formatter={(value) => [
                        `${value} ${getTimeSeriesUnit()}`, 
                        'Value'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name={getTimeSeriesTitle()} 
                      stroke={
                        selectedMetric === 'carbon' ? '#2A9D8F' : 
                        selectedMetric === 'community' ? '#457B9D' : '#4CAF50'
                      }
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Reduction Benchmarking</CardTitle>
              <CardDescription>
                How ECODATA's carbon reduction compares to industry benchmarks (in tonnes CO₂e)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={industryComparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      label={({ name, value }) => `${name}: ${value} tonnes`}
                      dataKey="value"
                    >
                      {industryComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImpactVisualization;