import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface ServiceDetailProps {
  title: string;
  heroTitle: string;
  description: string;
  content: {
    what: string[];
    benefits: string[];
    caseStudies: string[];
  };
  cta: {
    text: string;
    buttonText: string;
  };
  icon: string;
}

const ServiceDetail = ({
  title,
  heroTitle,
  description,
  content,
  cta,
  icon,
}: ServiceDetailProps) => {
  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-[#1E2D40]">
      {/* Back navigation */}
      <div className="container mx-auto px-4 pt-8">
        <Link href="/#services" className="inline-flex items-center text-[#2A9D8F] hover:text-[#38B593] mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Services
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-[#2A9D8F] bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-[#264653] dark:text-[#F4F1DE]">
                {title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-heading mb-6 text-[#2A9D8F]">
                {heroTitle}
              </h2>
              <p className="text-lg mb-8 dark:text-[#F4F1DE]">
                {description}
              </p>
            </div>
            <div className="w-32 h-32 md:w-48 md:h-48 bg-[#264653] bg-opacity-10 rounded-full flex items-center justify-center">
              <i className={`fas ${icon} text-5xl md:text-6xl text-[#2A9D8F]`}></i>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* What is this service */}
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-6 text-[#264653] dark:text-[#F4F1DE]">
                What We Offer
              </h3>
              <ul className="space-y-4">
                {content.what.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#2A9D8F] bg-opacity-20 flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                      <i className="fas fa-check text-sm text-[#2A9D8F]"></i>
                    </div>
                    <p className="dark:text-[#F4F1DE]">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who benefits */}
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-6 text-[#264653] dark:text-[#F4F1DE]">
                Who Benefits
              </h3>
              <ul className="space-y-4">
                {content.benefits.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#2A9D8F] bg-opacity-20 flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                      <i className="fas fa-user-check text-sm text-[#2A9D8F]"></i>
                    </div>
                    <p className="dark:text-[#F4F1DE]">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-12 bg-white dark:bg-[#264653] bg-opacity-20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-heading font-semibold mb-8 text-center text-[#264653] dark:text-[#F4F1DE]">
            Case Studies
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.caseStudies.map((study, index) => (
              <div 
                key={index} 
                className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-6"
              >
                <div className="w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-clipboard-check text-xl text-[#2A9D8F]"></i>
                </div>
                <p className="dark:text-[#F4F1DE]">{study}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#264653] text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-6">
            {cta.text}
          </h3>
          <Link href="/contact">
            <button className="px-8 py-3 bg-[#2A9D8F] hover:bg-[#38B593] text-white font-medium rounded-md transition-colors">
              {cta.buttonText}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;