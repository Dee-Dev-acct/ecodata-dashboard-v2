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
  engagement: [
    { year: '2020', value: 850 },
    { year: '2021', value: 1420 },
    { year: '2022', value: 2100 },
    { year: '2023', value: 2800 },
    { year: '2024', value: 3420 },
  ],
  literacy: [
    { year: '2020', value: 54 },
    { year: '2021', value: 98 },
    { year: '2022', value: 143 },
    { year: '2023', value: 198 },
    { year: '2024', value: 248 },
  ],
  dashboards: [
    { year: '2020', value: 2 },
    { year: '2021', value: 5 },
    { year: '2022', value: 7 },
    { year: '2023', value: 10 },
    { year: '2024', value: 12 },
  ],
  opendata: [
    { year: '2020', value: 3 },
    { year: '2021', value: 7 },
    { year: '2022', value: 11 },
    { year: '2023', value: 15 },
    { year: '2024', value: 19 },
  ]
};

// Comparative industry data
// In a real application, this would come from the API
const industryComparisonData = [
  { name: 'ECODATA', value: 248, fill: '#2A9D8F' },
  { name: 'Industry Average', value: 125, fill: '#E9C46A' },
  { name: 'Top Performer', value: 320, fill: '#457B9D' },
];

// Color mapping for categories
const categoryColors = {
  environmental: '#2A9D8F',
  social: '#457B9D',
  efficiency: '#4CAF50',
  literacy: '#2A9D8F',
  engagement: '#457B9D',
  dashboards: '#4CAF50',
  opendata: '#E76F51'
};

// Fixed data for alternative metrics chart
const alternativeMetricsChart = [
  {
    name: "Community Engagement",
    value: 3420,
    category: "engagement",
    fill: '#457B9D'
  },
  {
    name: "Digital Literacy",
    value: 248,
    category: "literacy",
    fill: '#2A9D8F'
  },
  {
    name: "Decision Dashboards",
    value: 12,
    category: "dashboards",
    fill: '#4CAF50'
  },
  {
    name: "Open Data",
    value: 19,
    category: "opendata",
    fill: '#E76F51'
  }
];

// Converting data for visualization - now uses fixed data
const prepareMetricsForChart = (_metrics: ImpactMetric[]) => {
  return alternativeMetricsChart;
};

const ImpactVisualization = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('engagement');
  
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
    if (selectedMetric === 'engagement') {
      return historicalData.engagement;
    } 
    if (selectedMetric === 'literacy') {
      return historicalData.literacy;
    }
    if (selectedMetric === 'dashboards') {
      return historicalData.dashboards;
    }
    if (selectedMetric === 'opendata') {
      return historicalData.opendata;
    }
    return historicalData.engagement;
  };
  
  // Get the appropriate title for the time series chart
  const getTimeSeriesTitle = () => {
    switch (selectedMetric) {
      case 'engagement':
        return 'Community Engagement Growth';
      case 'literacy':
        return 'Digital Literacy Improvements';
      case 'dashboards':
        return 'Decision Dashboards Deployed';
      case 'opendata':
        return 'Open Data Contributions';
      default:
        return 'Impact Progress';
    }
  };
  
  // Get the appropriate unit for the time series chart
  const getTimeSeriesUnit = () => {
    switch (selectedMetric) {
      case 'engagement':
        return 'hours';
      case 'literacy':
        return 'people';
      case 'dashboards':
        return 'dashboards';
      case 'opendata':
        return 'datasets';
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
                        const entry = props.payload;
                        if (entry.category === 'engagement') {
                          return [`${value} hours`, entry.name];
                        } else if (entry.category === 'literacy') {
                          return [`${value} participants`, entry.name];
                        } else if (entry.category === 'dashboards') {
                          return [`${value} dashboards`, entry.name];
                        } else if (entry.category === 'opendata') {
                          return [`${value} datasets`, entry.name];
                        }
                        return [value, entry.name];
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
                    <SelectItem value="engagement">Community Engagement Hours</SelectItem>
                    <SelectItem value="literacy">Digital Literacy Improvements</SelectItem>
                    <SelectItem value="dashboards">Decision Dashboards Deployed</SelectItem>
                    <SelectItem value="opendata">Open Data Contributions</SelectItem>
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
                    <YAxis unit={getTimeSeriesUnit().startsWith('d') ? '' : ''} />
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
                        selectedMetric === 'engagement' ? '#457B9D' : 
                        selectedMetric === 'literacy' ? '#2A9D8F' :
                        selectedMetric === 'dashboards' ? '#4CAF50' : '#E76F51'
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
              <CardTitle>Digital Literacy Benchmarking</CardTitle>
              <CardDescription>
                How ECODATA's digital literacy training compares to industry benchmarks (participants trained)
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
                      label={({ name, value }) => `${name}: ${value} participants`}
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