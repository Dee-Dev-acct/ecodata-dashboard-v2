import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDetail from "@/components/ServiceDetail";

const CommunityInnovationPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="Community Innovation & Social Impact"
        heroTitle="Technology for Social Change"
        description="We collaborate with communities and organizations to develop innovative technology solutions that address social and environmental challenges, emphasizing inclusive design and sustainable impact."
        content={{
          what: [
            "Collaborative co-design sessions with community stakeholders",
            "Development of custom tech solutions for social and environmental challenges",
            "Digital platforms for community engagement and participation",
            "Training and capacity building for community tech adoption",
            "Impact measurement frameworks for community initiatives",
            "Sustainable funding models for community tech projects"
          ],
          benefits: [
            "Community organizations seeking innovative approaches to local challenges",
            "Social enterprises looking to scale their impact through technology",
            "Local authorities implementing community engagement strategies",
            "Educational institutions developing community outreach programs",
            "Neighborhood groups organizing around environmental or social issues"
          ],
          caseStudies: [
            "Co-designed a community energy monitoring system with residents of a housing estate, resulting in 23% energy savings and the formation of a resident-led sustainability committee.",
            "Developed a digital platform connecting local food producers with community kitchens, reducing food waste by 45% and increasing access to fresh produce in food desert areas.",
            "Created a participatory mapping tool enabling residents to document environmental hazards, leading to targeted cleanup efforts and policy changes to prevent future contamination."
          ]
        }}
        cta={{
          text: "Ready to innovate with community at the center?",
          buttonText: "Let's Talk"
        }}
        icon="fa-people-group"
        impactStories={[
          {
            title: "Community Energy Collective",
            description: "We supported a community in creating their own renewable energy collective, combining solar installations with a digital platform for energy sharing and management.",
            metrics: "120 households participating | 65% reduction in energy bills | 30kW community-owned solar capacity",
            imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Urban Growing Technology Network",
            description: "Our team developed IoT systems and a knowledge-sharing platform for a network of urban growing spaces, enhancing productivity and community cohesion.",
            metrics: "15 growing sites connected | 2.5 tonnes of food produced annually | 350+ community members engaged",
            imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default CommunityInnovationPage;