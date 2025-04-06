import React from "react";
import ServiceDetail from "@/components/ServiceDetail";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const ItConsultancyPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="IT Consultancy"
        heroTitle="Sustainable and Smart IT Solutions"
        description="Our IT consultancy services focus on creating efficient, sustainable, and future-proof technology environments for organizations of all sizes, with an emphasis on environmental responsibility."
        content={{
          what: [
            "Comprehensive infrastructure audits and optimization recommendations",
            "Migration strategies for cloud-native environments",
            "Workflow automation to increase efficiency and reduce resource usage",
            "Data privacy and security strategy development",
            "Green IT assessments to reduce environmental impact"
          ],
          benefits: [
            "Small to medium businesses looking to modernize their IT infrastructure",
            "Organizations seeking to reduce their digital carbon footprint",
            "Nonprofits needing cost-effective IT solutions",
            "Businesses concerned about data privacy and security",
            "Teams wanting to improve efficiency through automation"
          ],
          caseStudies: [
            "Helped a local charity reduce their IT costs by 40% through cloud migration and infrastructure optimization, while improving system reliability.",
            "Developed an automated workflow system for a community health provider, saving staff 15 hours per week on administrative tasks.",
            "Conducted a comprehensive security audit for an environmental nonprofit, implementing protections that prevented a subsequent ransomware attempt."
          ]
        }}
        cta={{
          text: "Ready to transform your organization's IT approach?",
          buttonText: "Book a free strategy session"
        }}
        icon="fa-server"
      />
      <Footer />
    </>
  );
};

export default ItConsultancyPage;