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
        description="We create beautiful, functional, and environmentally responsible websites and web applications that meet your organization's needs while minimizing digital carbon footprint."
        content={{
          what: [
            "Responsive website design optimized for all devices",
            "Interactive data dashboards for impact reporting",
            "Community engagement platforms and portals",
            "Low-carbon, accessible design practices",
            "Content management systems for easy updates"
          ],
          benefits: [
            "Environmental and social organizations needing an online presence",
            "Nonprofits requiring impact visualization tools",
            "Research groups sharing findings with the public",
            "Community initiatives looking to engage local residents",
            "Social enterprises showcasing their products and services"
          ],
          caseStudies: [
            "Designed and built a carbon-neutral wildlife conservation website featuring real-time tracking data of endangered species for public engagement.",
            "Created an interactive community portal for a neighborhood association, resulting in 300% increased participation in local initiatives.",
            "Developed a lightweight, accessibility-focused website for a disability advocacy group that achieved perfect Lighthouse scores."
          ]
        }}
        cta={{
          text: "Need a website built with purpose?",
          buttonText: "Let's talk"
        }}
        icon="fa-code"
      />
      <Footer />
    </>
  );
};

export default WebDevelopmentPage;