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
        description="We collaborate with local organizations to tackle community issues through innovative technology solutions, focusing on sustainable impact and knowledge transfer."
        content={{
          what: [
            "Collaborative tech development to address community challenges",
            "Data-driven solutions for social and environmental issues",
            "Digital platforms for community engagement and empowerment",
            "Technology training and knowledge transfer to community leaders",
            "Ongoing support and maintenance for community-led tech initiatives"
          ],
          benefits: [
            "Nonprofit organizations seeking technological solutions",
            "Community groups addressing local social issues",
            "Local governments implementing digital community engagement",
            "Healthcare providers serving vulnerable populations",
            "Environmental organizations tracking and visualizing impact data"
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
      />
      <Footer />
    </>
  );
};

export default SocialImpactPage;