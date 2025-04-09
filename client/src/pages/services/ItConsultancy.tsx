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
        description="Our IT consultancy services focus on creating efficient, sustainable, and future-proof technology environments for organisations of all sizes, with an emphasis on environmental responsibility."
        content={{
          what: [
            "Comprehensive infrastructure audits and optimisation recommendations",
            "Migration strategies for cloud-native environments",
            "Workflow automation to increase efficiency and reduce resource usage",
            "Data privacy and security strategy development",
            "Green IT assessments to reduce environmental impact"
          ],
          benefits: [
            "Small to medium businesses looking to modernise their IT infrastructure",
            "Organisations seeking to reduce their digital carbon footprint",
            "Non-profits needing cost-effective IT solutions",
            "Businesses concerned about data privacy and security",
            "Teams wanting to improve efficiency through automation"
          ],
          caseStudies: [
            "Helped a local charity reduce their IT costs by 40% through cloud migration and infrastructure optimisation, while improving system reliability.",
            "Developed an automated workflow system for a community health provider, saving staff 15 hours per week on administrative tasks.",
            "Conducted a comprehensive security audit for an environmental non-profit, implementing protections that prevented a subsequent ransomware attempt."
          ]
        }}
        cta={{
          text: "Ready to transform your organisation's IT approach?",
          buttonText: "Book a free strategy session"
        }}
        icon="fa-server"
        impactStories={[
          {
            title: "Non-profit Cloud Transformation",
            description: "We helped a small environmental non-profit transition to cloud infrastructure, dramatically reducing their IT costs while improving reliability and enabling remote work capabilities.",
            metrics: "42% reduction in IT expenditure | 99.9% system uptime | 30% decrease in energy consumption",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Sustainable IT Implementation",
            description: "Our green IT assessment and implementation programme helped a medium-sized business reduce their carbon footprint while modernising their infrastructure.",
            metrics: "25% energy reduction | E-waste properly recycled: 350kg | £15,000 annual savings on energy costs",
            imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default ItConsultancyPage;