const About = () => {
  return (
    <section id="about" className="py-16 bg-[#F4F1DE] dark:bg-[#264653]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-9 relative inline-block">
              <span>About ECODATA CIC</span>
              <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
            </h2>
            <p className="text-lg mb-4 dark:text-[#F4F1DE]">
              Founded in 2020, ECODATA CIC is a Community Interest Company dedicated to using data analytics and technology to create positive environmental and social impact.
            </p>
            <p className="mb-6 dark:text-[#F4F1DE]">
              As a social enterprise, we reinvest our profits into community projects and environmental initiatives. Our team combines expertise in data science, environmental research, and IT consultancy.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-[#1A323C] p-4 rounded-lg shadow-sm">
                <div className="text-[#2A9D8F] text-3xl font-bold mb-2">100+</div>
                <div className="text-sm dark:text-[#F4F1DE]">Projects Completed</div>
              </div>
              <div className="bg-white dark:bg-[#1A323C] p-4 rounded-lg shadow-sm">
                <div className="text-[#2A9D8F] text-3xl font-bold mb-2">35+</div>
                <div className="text-sm dark:text-[#F4F1DE]">Community Partners</div>
              </div>
              <div className="bg-white dark:bg-[#1A323C] p-4 rounded-lg shadow-sm">
                <div className="text-[#2A9D8F] text-3xl font-bold mb-2">12+</div>
                <div className="text-sm dark:text-[#F4F1DE]">Awards & Recognitions</div>
              </div>
              <div className="bg-white dark:bg-[#1A323C] p-4 rounded-lg shadow-sm">
                <div className="text-[#2A9D8F] text-3xl font-bold mb-2">5k+</div>
                <div className="text-sm dark:text-[#F4F1DE]">Trees Planted</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1A323C] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-semibold mb-3 flex items-center">
                <i className="fas fa-bullseye text-[#2A9D8F] mr-3"></i>
                Our Mission
              </h3>
              <p className="dark:text-[#F4F1DE]">
                To democratize access to environmental data and empower organizations to make sustainable decisions through accessible technology solutions.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#1A323C] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-semibold mb-3 flex items-center">
                <i className="fas fa-eye text-[#2A9D8F] mr-3"></i>
                Our Vision
              </h3>
              <p className="dark:text-[#F4F1DE]">
                A world where all organizations, regardless of size, have the data tools and knowledge needed to minimize environmental impact and maximize social good.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#1A323C] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-semibold mb-3 flex items-center">
                <i className="fas fa-leaf text-[#2A9D8F] mr-3"></i>
                Our Values
              </h3>
              <ul className="list-disc list-inside dark:text-[#F4F1DE] space-y-2">
                <li>Environmental responsibility in all operations</li>
                <li>Data transparency and ethical usage</li>
                <li>Community-centered approach to technology</li>
                <li>Continuous innovation and learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
