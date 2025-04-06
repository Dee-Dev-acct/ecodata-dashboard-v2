import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDetail from "@/components/ServiceDetail";

const DataAnalyticsPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="Data Analytics"
        heroTitle="Transforming Data into Environmental Impact"
        description="We harness the power of data analysis and visualization to help organizations understand environmental patterns, make informed decisions, and communicate their sustainability efforts effectively."
        content={{
          what: [
            "Environmental data collection and normalization",
            "Statistical analysis of sustainability metrics",
            "Interactive dashboards and visualization tools",
            "Predictive modeling for environmental outcomes",
            "Data-driven sustainability reporting and communication",
            "Custom algorithms for specific environmental applications"
          ],
          benefits: [
            "Environmental nonprofits seeking to measure and communicate impact",
            "Local authorities tracking progress on sustainability goals",
            "Research institutions needing specialized environmental data analysis",
            "Businesses implementing data-driven sustainability strategies",
            "Community organizations advocating for evidence-based environmental policies"
          ],
          caseStudies: [
            "Developed a real-time air quality monitoring dashboard for a community coalition, empowering residents to track pollution patterns and advocate for cleaner air policies.",
            "Created a comprehensive biodiversity database for a conservation trust, enabling data-driven decisions about habitat protection and restoration priorities.",
            "Designed predictive models for flood risk assessment in vulnerable communities, helping local authorities implement targeted prevention measures."
          ]
        }}
        cta={{
          text: "Ready to harness the power of environmental data?",
          buttonText: "Let's Talk"
        }}
        icon="fa-chart-line"
        impactStories={[
          {
            title: "Air Quality Monitoring Network",
            description: "We implemented a community-based air quality monitoring network across underserved neighborhoods, enabling evidence-based advocacy for environmental justice.",
            metrics: "15 monitoring stations | 500+ residents engaged | 35% reduction in local pollutants",
            imageUrl: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Biodiversity Conservation Analytics",
            description: "Our custom analytics platform helped a wildlife trust identify critical conservation priorities and measure the impact of their habitat restoration efforts.",
            metrics: "32 endangered species tracked | 85% increase in targeted conservation funding",
            imageUrl: "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default DataAnalyticsPage;