import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#264653] dark:bg-[#1A323C] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-[#2A9D8F] font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-heading font-bold">ECODATA <span className="text-[#38B593]">CIC</span></span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              A Community Interest Company dedicated to using data for environmental and social good.
            </p>
            <p className="text-sm text-gray-300">
              Registered in England & Wales<br />
              Company No: 16034410<br />
              Registered Office: 128 City Road<br />
              London, EC1V 2NX
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
              <Link href="/impact" onClick={() => sessionStorage.setItem('referrer', 'footer')} className="text-gray-300 hover:text-white transition-colors">Our Impact</Link>
              <a href="#technology" className="text-gray-300 hover:text-white transition-colors">Technology</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">Resources</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Case Studies</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Publications</a>
              <Link href="/data-insights" onClick={() => sessionStorage.setItem('referrer', 'footer')} className="text-gray-300 hover:text-white transition-colors">Data Insights</Link>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a>
            </nav>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Environmental Policy</a>
            </nav>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ECODATA CIC. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
