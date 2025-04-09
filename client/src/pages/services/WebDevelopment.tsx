import React from "react";
import ServiceDetail from "@/components/ServiceDetail";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const WebDevelopmentPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="Web Development"
        heroTitle="Eco-Conscious Web Design"
        description="We create beautiful, functional, and environmentally responsible websites and web applications that meet your organisation's needs while minimising digital carbon footprint."
        content={{
          what: [
            "Responsive website design optimised for all devices",
            "Interactive data dashboards for impact reporting",
            "Community engagement platforms and portals",
            "Low-carbon, accessible design practices",
            "Content management systems for easy updates"
          ],
          benefits: [
            "Environmental and social organisations needing an online presence",
            "Non-profits requiring impact visualisation tools",
            "Research groups sharing findings with the public",
            "Community initiatives looking to engage local residents",
            "Social enterprises showcasing their products and services"
          ],
          caseStudies: [
            "Designed and built a carbon-neutral wildlife conservation website featuring real-time tracking data of endangered species for public engagement.",
            "Created an interactive community portal for a neighbourhood association, resulting in 300% increased participation in local initiatives.",
            "Developed a lightweight, accessibility-focused website for a disability advocacy group that achieved perfect Lighthouse scores."
          ]
        }}
        cta={{
          text: "Need a website built with purpose?",
          buttonText: "Let's talk"
        }}
        icon="fa-code"
        impactStories={[
          {
            title: "Conservation Trust Digital Transformation",
            description: "We rebuilt the digital presence of a wildlife conservation trust, creating a low-carbon website that showcases their work while dramatically improving engagement and funding.",
            metrics: "68% reduction in page carbon emissions | 125% increase in online donations | 40% boost in volunteer sign-ups",
            imageUrl: "https://images.unsplash.com/photo-1550645612-83f5d594b671?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Accessible Community Portal",
            description: "Our team developed a fully accessible community engagement platform that connects residents and local government, enabling inclusive participation in local decision-making.",
            metrics: "WCAG AAA compliance achieved | 3,500+ active community users | 85% user satisfaction rating",
            imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default WebDevelopmentPage;