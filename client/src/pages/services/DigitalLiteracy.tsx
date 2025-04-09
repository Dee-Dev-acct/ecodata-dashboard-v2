import React from "react";
import ServiceDetail from "@/components/ServiceDetail";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const DigitalLiteracyPage = () => {
  return (
    <>
      <Header />
      <ServiceDetail
        title="Digital Literacy & Tech Training"
        heroTitle="Empowering Communities Through Digital Skills"
        description="We offer inclusive digital education programmes to bridge the digital divide, making technology accessible to everyone regardless of background or experience level."
        content={{
          what: [
            "Basic computer skills workshops for beginners and the digitally excluded",
            "Data literacy training to help organisations make sense of their information",
            "Cybersecurity fundamentals to protect individuals and small organisations",
            "Introduction to coding with Python and HTML for beginners",
            "Customised training programmes for community groups and organisations"
          ],
          benefits: [
            "Community organisations looking to upskill their members",
            "Individuals seeking to enter the digital workforce",
            "Older adults wanting to stay connected in a digital world",
            "Young people interested in technology careers",
            "Underserved communities with limited access to digital resources"
          ],
          caseStudies: [
            "Partnered with a local community centre to deliver a 12-week digital skills programme for unemployed adults, resulting in 70% of participants finding employment.",
            "Developed and implemented a specialised data literacy course for environmental non-profits, enabling them to better collect and analyse field data.",
            "Created a bespoke cybersecurity training programme for small business owners, helping protect local businesses from common online threats."
          ]
        }}
        cta={{
          text: "Empower your community with essential digital skills",
          buttonText: "Start a workshop today"
        }}
        icon="fa-laptop-code"
        impactStories={[
          {
            title: "Senior Digital Inclusion Project",
            description: "Our targeted digital literacy programme for older adults in assisted living facilities has helped reduce isolation and improve quality of life through technology access.",
            metrics: "250+ seniors trained | 78% now use video calls with family | 65% reported reduced feelings of isolation",
            imageUrl: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "Rural Digital Access Initiative",
            description: "Working with isolated rural communities, we've implemented digital skills programmes alongside connectivity solutions to bridge the urban-rural digital divide.",
            metrics: "5 rural communities served | 320+ participants | 85% continued using digital services after 6 months",
            imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          }
        ]}
      />
      <Footer />
    </>
  );
};

export default DigitalLiteracyPage;