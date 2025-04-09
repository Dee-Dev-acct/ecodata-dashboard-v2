import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDetail from "@/components/ServiceDetail";

const EnvironmentalResearchPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="Environmental Research"
        heroTitle="Data-Driven Ecological Analysis"
        description="We conduct in-depth environmental research that provides organisations with crucial insights for sustainability planning, conservation efforts, and climate resilience strategies."
        content={{
          what: [
            "Comprehensive environmental data collection and analysis",
            "Biodiversity monitoring and ecological impact assessments",
            "Carbon footprint calculations and reduction strategies",
            "Climate change resilience planning for organisations and communities",
            "Environmental policy research and recommendations"
          ],
          benefits: [
            "Conservation organisations seeking data-driven approaches",
            "Local governments developing climate action plans",
            "Businesses implementing sustainability strategies",
            "Research institutions requiring environmental data expertise",
            "Community groups advocating for environmental protection"
          ],
          caseStudies: [
            "Partnered with a regional watershed alliance to develop a comprehensive monitoring system tracking water quality across 15 sites, enabling data-driven conservation decisions.",
            "Conducted a year-long urban biodiversity study for a city council, resulting in policy changes that increased green space by 12% over three years.",
            "Designed and implemented carbon monitoring systems for a community forest project, helping secure carbon credit certification and sustainable funding."
          ]
        }}
        cta={{
          text: "Ready to collaborate on environmental research?",
          buttonText: "Let's Talk"
        }}
        icon="fa-leaf"
        impactStories={[
          {
            title: "Restoring Urban Biodiversity",
            description: "Working with the Manchester Green Corridor initiative, we developed monitoring systems that tracked biodiversity increases following urban rewilding efforts.",
            metrics: "27% increase in pollinator species | 12 hectares of land transformed",
            imageUrl: "https://images.unsplash.com/photo-1610890557331-8646fea52c1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Carbon Sequestration Monitoring",
            description: "Our team developed innovative measuring techniques for a community woodland project that enabled accurate carbon sequestration reporting and verification.",
            metrics: "1,200 tonnes CO2 sequestered annually | £45,000 in carbon credits generated",
            imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default EnvironmentalResearchPage;