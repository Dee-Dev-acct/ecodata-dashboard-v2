import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart2, PieChart as PieChartIcon, TrendingUp, Filter } from 'lucide-react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Sample data for charts
const environmentalImpactData = [
  { name: '2020', carbon: 35, waste: 28, energy: 42 },
  { name: '2021', carbon: 45, waste: 32, energy: 48 },
  { name: '2022', carbon: 60, waste: 45, energy: 56 },
  { name: '2023', carbon: 75, waste: 58, energy: 68 },
  { name: '2024', carbon: 92, waste: 70, energy: 82 },
];

const projectDistributionData = [
  { name: 'Environmental', value: 45 },
  { name: 'Social', value: 30 },
  { name: 'Digital Literacy', value: 15 },
  { name: 'Community Innovation', value: 10 },
];

const COLORS = ['#2A9D8F', '#457B9D', '#E9C46A', '#F4A261'];

const beneficiaryData = [
  { name: 'Jan', individuals: 400, organizations: 240 },
  { name: 'Feb', individuals: 430, organizations: 250 },
  { name: 'Mar', individuals: 470, organizations: 260 },
  { name: 'Apr', individuals: 520, organizations: 270 },
  { name: 'May', individuals: 550, organizations: 300 },
  { name: 'Jun', individuals: 580, organizations: 320 },
  { name: 'Jul', individuals: 620, organizations: 350 },
  { name: 'Aug', individuals: 660, organizations: 380 },
  { name: 'Sep', individuals: 700, organizations: 410 },
  { name: 'Oct', individuals: 740, organizations: 440 },
  { name: 'Nov', individuals: 780, organizations: 470 },
  { name: 'Dec', individuals: 820, organizations: 500 },
];

// Sample reports data
const reports = [
  {
    id: 1,
    title: 'Annual Environmental Impact Report 2023',
    description: 'Comprehensive analysis of our environmental initiatives and their measurable outcomes.',
    date: 'December 2023',
    category: 'Environmental',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'Social Impact Measurement Framework',
    description: 'Methodology and metrics used to evaluate the social impact of our community projects.',
    date: 'October 2023',
    category: 'Social',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'Digital Literacy Program Outcomes',
    description: 'Analysis of the effectiveness and reach of our digital literacy training initiatives.',
    date: 'September 2023',
    category: 'Digital Literacy',
    downloadUrl: '#'
  },
  {
    id: 4,
    title: 'Community Innovation Hub: First Year Results',
    description: 'Performance metrics and case studies from our community innovation support programs.',
    date: 'August 2023',
    category: 'Community Innovation',
    downloadUrl: '#'
  }
];

// Sample research findings
const researchFindings = [
  {
    id: 1,
    title: 'Digital Exclusion Patterns in Rural Communities',
    summary: 'Our research identified significant digital exclusion patterns affecting rural communities, with limited broadband access being the primary barrier to digital participation.',
    impact: 'These findings have informed our targeted Digital Literacy programs and advocacy efforts for improved rural connectivity.',
    year: 2023
  },
  {
    id: 2,
    title: 'Effective Strategies for Community-Led Environmental Monitoring',
    summary: 'Analysis of citizen science projects revealed that community-led environmental monitoring is most effective when paired with accessible data visualization tools and regular expert feedback.',
    impact: 'This research has shaped our approach to community environmental projects, emphasizing user-friendly technology and expert mentorship.',
    year: 2023
  },
  {
    id: 3,
    title: 'Social Return on Investment of Tech Training Programs',
    summary: 'Our SROI analysis found that for every £1 invested in digital skills training, approximately £4.30 of social value is created through improved employment outcomes and digital inclusion.',
    impact: 'These metrics have strengthened our funding applications and helped optimize program delivery for maximum social return.',
    year: 2022
  }
];

const DataInsights = () => {
  const [reportFilter, setReportFilter] = useState('All');
  const [location] = useLocation();
  const [backLink, setBackLink] = useState({ path: "/#services", text: "Back to Services" });
  
  // Determine where the user came from
  useEffect(() => {
    // Check for referrer in sessionStorage
    const referrer = sessionStorage.getItem('referrer');
    
    if (referrer === 'footer') {
      setBackLink({ path: "/", text: "Back to Home" });
    }
    // Add more conditions as needed
    
    // Clean up
    return () => {
      sessionStorage.removeItem('referrer');
    };
  }, []);
  
  const filteredReports = reportFilter === 'All' 
    ? reports 
    : reports.filter(report => report.category === reportFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back navigation */}
      <div className="mb-8">
        <Link href={backLink.path} className="inline-flex items-center text-[#2A9D8F] hover:text-[#38B593]">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {backLink.text}
        </Link>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Data Insights</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the measurable impact of our work through data visualization, research findings, and analytical reports that drive our evidence-based approach.
        </p>
      </motion.div>

      {/* Data Visualizations Section */}
      <motion.section 
        className="mb-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-3xl font-bold mb-10 text-center"
          variants={fadeIn}
        >
          Impact Visualizations
        </motion.h2>

        <Tabs defaultValue="environmental" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
            <TabsTrigger value="projects">Project Distribution</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiary Reach</TabsTrigger>
          </TabsList>
          <TabsContent value="environmental">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Environmental Impact Metrics (2020-2024)
                </CardTitle>
                <CardDescription>
                  Tracking our progress in carbon reduction, waste management, and energy efficiency initiatives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={environmentalImpactData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="carbon" name="Carbon Reduction (tons)" fill="#2A9D8F" />
                      <Bar dataKey="waste" name="Waste Reduction (tons)" fill="#457B9D" />
                      <Bar dataKey="energy" name="Energy Efficiency (% improvement)" fill="#E9C46A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <p>Source: ECODATA CIC Annual Environmental Reports</p>
                <p>Last updated: April 2024</p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Project Focus Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of our active projects by primary impact category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <p>Source: ECODATA CIC Project Database</p>
                <p>Last updated: April 2024</p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="beneficiaries">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Beneficiary Growth (2023)
                </CardTitle>
                <CardDescription>
                  Monthly growth in individual and organizational beneficiaries of our programs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={beneficiaryData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="individuals" name="Individual Beneficiaries" stroke="#2A9D8F" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="organizations" name="Partner Organizations" stroke="#457B9D" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <p>Source: ECODATA CIC Beneficiary Database</p>
                <p>Last updated: January 2024</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Research Findings Section */}
      <motion.section 
        className="mb-20"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-10 text-center"
          variants={fadeIn}
        >
          Key Research Findings
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchFindings.map((finding) => (
            <motion.div 
              key={finding.id}
              className="bg-card rounded-xl overflow-hidden shadow-sm border h-full"
              variants={fadeIn}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {finding.year}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-4">{finding.title}</h3>
                <p className="mb-4 text-muted-foreground flex-grow">{finding.summary}</p>
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold mb-2">Impact on Our Work:</h4>
                  <p className="text-sm">{finding.impact}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Reports & Resources Section */}
      <motion.section 
        className="mb-20"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6 text-center"
          variants={fadeIn}
        >
          Reports & Resources
        </motion.h2>
        <motion.p 
          className="text-center text-muted-foreground max-w-3xl mx-auto mb-10"
          variants={fadeIn}
        >
          Download our detailed reports, frameworks, and research publications to dive deeper into our impact data.
        </motion.p>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center rounded-md border p-1 bg-muted/30">
            <Button 
              variant={reportFilter === 'All' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setReportFilter('All')}
              className="rounded-sm"
            >
              All
            </Button>
            <Button 
              variant={reportFilter === 'Environmental' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setReportFilter('Environmental')}
              className="rounded-sm"
            >
              Environmental
            </Button>
            <Button 
              variant={reportFilter === 'Social' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setReportFilter('Social')}
              className="rounded-sm"
            >
              Social
            </Button>
            <Button 
              variant={reportFilter === 'Digital Literacy' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setReportFilter('Digital Literacy')}
              className="rounded-sm"
            >
              Digital Literacy
            </Button>
            <Button 
              variant={reportFilter === 'Community Innovation' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setReportFilter('Community Innovation')}
              className="rounded-sm"
            >
              Community Innovation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <motion.div 
              key={report.id} 
              className="border rounded-lg bg-card p-6 flex items-start gap-4 shadow-sm"
              variants={fadeIn}
            >
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {report.date}
                  </span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.div 
        className="bg-primary/5 rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-4">Need Custom Data Analysis?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Our team can provide tailored data analysis, visualization, and impact assessment services for your organization's sustainability and social impact initiatives.
        </p>
        <Button size="lg" className="gap-2">
          <Filter className="h-5 w-5" />
          Request Custom Analysis
        </Button>
      </motion.div>
    </div>
  );
};

export default DataInsights;