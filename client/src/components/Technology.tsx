const TechItem = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <div className="bg-white dark:bg-[#1A323C] p-4 rounded-lg shadow-sm flex items-center">
      <div className="w-10 h-10 mr-4 flex items-center justify-center bg-[#2A9D8F] bg-opacity-10 rounded-md">
        <i className={`${icon} text-[#2A9D8F]`}></i>
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm dark:text-[#F4F1DE]">{description}</p>
      </div>
    </div>
  );
};

const Technology = () => {
  return (
    <section id="technology" className="py-16 bg-[#F4F1DE] dark:bg-[#264653]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-7 relative inline-block">
            <span>Our Technology Framework</span>
            <span className="absolute -bottom-3 left-0 w-full h-2 bg-[#2A9D8F] opacity-40"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            We leverage cutting-edge technologies to deliver sustainable solutions with measurable impact.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-heading font-semibold mb-6">Data Analytics Stack</h3>
            <div className="space-y-4">
              <TechItem 
                icon="fas fa-database" 
                title="SQL Server & PostgreSQL" 
                description="Enterprise-grade databases for secure, scalable data storage"
              />
              <TechItem 
                icon="fas fa-chart-pie" 
                title="Python Data Science Stack" 
                description="Pandas, NumPy, and scikit-learn for advanced analytics"
              />
              <TechItem 
                icon="fas fa-globe" 
                title="GIS & Spatial Analysis" 
                description="QGIS, PostGIS, and Leaflet for geospatial visualization"
              />
              <TechItem 
                icon="fas fa-brain" 
                title="Machine Learning" 
                description="Predictive modeling for environmental impact assessment"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-heading font-semibold mb-6">Web & Application Development</h3>
            <div className="space-y-4">
              <TechItem 
                icon="fab fa-node-js" 
                title="Node.js & Express" 
                description="Efficient server-side JavaScript for web applications"
              />
              <TechItem 
                icon="fab fa-react" 
                title="React & Modern JavaScript" 
                description="Component-based UIs for interactive data dashboards"
              />
              <TechItem 
                icon="fas fa-mobile-alt" 
                title="Responsive Web Design" 
                description="Cross-device compatible applications with progressive enhancement"
              />
              <TechItem 
                icon="fas fa-cloud" 
                title="Cloud Services" 
                description="Azure and AWS for scalable, energy-efficient deployments"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
