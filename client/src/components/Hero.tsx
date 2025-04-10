import { Link } from "wouter";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <section className="relative bg-[#F4F1DE] dark:bg-[#264653] py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
              Data-Driven <span className="text-[#2A9D8F]">Solutions</span> for Environmental Impact
            </h1>
            <p className="text-xl mb-8 dark:text-[#F4F1DE] leading-relaxed">
              ECODATA CIC provides IT consultancy, data analytics, and environmental research services to help organisations make sustainable decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => scrollToSection('services')} 
                className="px-6 py-3 bg-[#2A9D8F] hover:bg-[#1F7268] text-white font-medium rounded-lg transition-colors shadow-md"
              >
                Our Services
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="px-6 py-3 border-2 border-[#2A9D8F] bg-[#E9C46A] text-[#264653] hover:bg-[#2A9D8F] hover:text-white font-medium rounded-lg transition-colors shadow-md"
              >
                Get in Touch
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#2A9D8F] rounded-full opacity-10"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#264653] rounded-full opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Interactive data dashboard displaying environmental sustainability metrics with colourful graphs and visualisations for informed decision-making" 
              className="w-full h-auto rounded-lg shadow-xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
