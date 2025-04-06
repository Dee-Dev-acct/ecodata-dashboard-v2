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
        description="We offer inclusive digital education programs to bridge the digital divide, making technology accessible to everyone regardless of background or experience level."
        content={{
          what: [
            "Basic computer skills workshops for beginners and the digitally excluded",
            "Data literacy training to help organizations make sense of their information",
            "Cybersecurity fundamentals to protect individuals and small organizations",
            "Introduction to coding with Python and HTML for beginners",
            "Customized training programs for community groups and organizations"
          ],
          benefits: [
            "Community organizations looking to upskill their members",
            "Individuals seeking to enter the digital workforce",
            "Older adults wanting to stay connected in a digital world",
            "Young people interested in technology careers",
            "Underserved communities with limited access to digital resources"
          ],
          caseStudies: [
            "Partnered with a local community center to deliver a 12-week digital skills program for unemployed adults, resulting in 70% of participants finding employment.",
            "Developed and implemented a specialized data literacy course for environmental nonprofits, enabling them to better collect and analyze field data.",
            "Created a bespoke cybersecurity training program for small business owners, helping protect local businesses from common online threats."
          ]
        }}
        cta={{
          text: "Empower your community with essential digital skills",
          buttonText: "Start a workshop today"
        }}
        icon="fa-laptop-code"
      />
      <Footer />
    </>
  );
};

export default DigitalLiteracyPage;