import React from "react";
import ServiceDetail from "@/components/ServiceDetail";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const SocialImpactPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="Community Innovation & Social Impact Projects"
        heroTitle="Co-creating Tech for Social Good"
        description="We collaborate with local organisations to tackle community issues through innovative technology solutions, focusing on sustainable impact and knowledge transfer."
        content={{
          what: [
            "Collaborative tech development to address community challenges",
            "Data-driven solutions for social and environmental issues",
            "Digital platforms for community engagement and empowerment",
            "Technology training and knowledge transfer to community leaders",
            "Ongoing support and maintenance for community-led tech initiatives"
          ],
          benefits: [
            "Non-profit organisations seeking technological solutions",
            "Community groups addressing local social issues",
            "Local governments implementing digital community engagement",
            "Healthcare providers serving vulnerable populations",
            "Environmental organisations tracking and visualising impact data"
          ],
          caseStudies: [
            "Developed a mobile application for a homelessness charity to connect rough sleepers with available shelter beds and support services in real-time.",
            "Created a digital platform for youth engagement that connected young people with local volunteering opportunities and skill development workshops.",
            "Built an accessibility mapping tool enabling people with mobility challenges to plan routes around the city based on accessible infrastructure."
          ]
        }}
        cta={{
          text: "Have a community idea? Let's co-create a solution",
          buttonText: "Start your project"
        }}
        icon="fa-hands-helping"
        impactStories={[
          {
            title: "Homelessness Support Network",
            description: "Our digital platform connecting homeless individuals with available shelter beds and support services has transformed emergency response and resource allocation in the city.",
            metrics: "87% reduction in unused shelter beds | 450+ individuals connected to services monthly",
            imageUrl: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Youth Civic Engagement Platform",
            description: "We co-designed a digital platform with young people from underserved communities, creating pathways for civic participation and community leadership development.",
            metrics: "1,200+ active youth users | 25 community projects launched | 85% reported increased sense of agency",
            imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default SocialImpactPage;