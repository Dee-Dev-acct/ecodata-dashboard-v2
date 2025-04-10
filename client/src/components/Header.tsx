import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useTheme } from "@/components/ThemeProvider";
import { ChevronDown, User } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleResourcesDropdown = () => {
    setResourcesOpen(!resourcesOpen);
  };

  const toggleServicesDropdown = () => {
    setServicesOpen(!servicesOpen);
    setResourcesOpen(false);
  };

  // Close the dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#333333] shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#2A9D8F] flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-heading font-bold dark:text-white">
            ECODATA <span className="text-[#2A9D8F]">CIC</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            onClick={() => window.scrollTo(0, 0)}
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Home
          </Link>
          <a 
            href="#about" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            About
          </a>
          <div
            className="relative"
            ref={servicesDropdownRef}
          >
            <button
              onClick={toggleServicesDropdown}
              className="flex items-center font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors focus:outline-none"
            >
              Services
              <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-[#264653] z-10">
                <div className="py-1 rounded-md bg-white dark:bg-[#264653] shadow-xs">
                  <Link 
                    href="/services/digital-literacy" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Digital Literacy
                  </Link>
                  <Link 
                    href="/services/social-impact" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Social Impact
                  </Link>
                  <Link 
                    href="/services/it-consultancy" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    IT Consultancy
                  </Link>
                  <Link 
                    href="/services/web-development" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Web Development
                  </Link>
                  <Link 
                    href="/services/environmental-research" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Environmental Research
                  </Link>
                  <Link 
                    href="/services/data-analytics" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Data Analytics
                  </Link>
                  <Link 
                    href="/services/community-innovation" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Community Innovation
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <a 
            href="#technology" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Technology
          </a>
          <div className="relative">
            <button
              onClick={() => {
                // If on home page, scroll to impact section
                if (window.location.pathname === '/') {
                  const impactElement = document.getElementById('impact');
                  if (impactElement) {
                    impactElement.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  // Navigate to impact page
                  window.location.href = '/impact';
                }
              }}
              className="flex items-center font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors focus:outline-none"
            >
              Impact
            </button>
          </div>
          <Link 
            href="/book-appointment" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Book Appointment
          </Link>
          <div
            className="relative"
            ref={resourcesDropdownRef}
          >
            <button
              onClick={toggleResourcesDropdown}
              className="flex items-center font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors focus:outline-none"
            >
              Resources
              <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#264653] z-10">
                <div className="py-1 rounded-md bg-white dark:bg-[#264653] shadow-xs">
                  <Link 
                    href="/blog" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    href="/case-studies" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Case Studies
                  </Link>
                  <Link 
                    href="/publications" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Publications
                  </Link>
                  <Link 
                    href="/faqs" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link 
                    href="/data-insights" 
                    className="block px-4 py-2 text-sm hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-[#F4F1DE] transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Data Insights
                  </Link>
                </div>
              </div>
            )}
          </div>
          <a 
            href="#contact" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Contact
          </a>
          <Link 
            href="/admin/login" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors flex items-center gap-1"
          >
            <User size={16} />
            Login
          </Link>
        </nav>
        
        {/* Theme toggler and mobile menu button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[#F4F1DE] dark:hover:bg-[#264653] transition-colors"
          >
            {theme === 'light' ? (
              <i className="fa fa-sun text-yellow-500"></i>
            ) : (
              <i className="fa fa-moon text-blue-300"></i>
            )}
          </button>
          
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded md:hidden"
          >
            <i className="fa fa-bars text-lg dark:text-white"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-[#264653] shadow-lg absolute w-full`}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/" 
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Home
            </Link>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              About
            </a>
            <div
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                <span>Services</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {servicesOpen && (
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  <Link 
                    href="/services/digital-literacy" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Digital Literacy
                  </Link>
                  <Link 
                    href="/services/social-impact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Social Impact
                  </Link>
                  <Link 
                    href="/services/it-consultancy" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    IT Consultancy
                  </Link>
                  <Link 
                    href="/services/web-development" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Web Development
                  </Link>
                  <Link 
                    href="/services/environmental-research" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Environmental Research
                  </Link>
                  <Link 
                    href="/services/data-analytics" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Data Analytics
                  </Link>
                  <Link 
                    href="/services/community-innovation" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Community Innovation
                  </Link>
                </div>
              )}
            </div>
            <a 
              href="#technology" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Technology
            </a>
            <Link 
              href="/impact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Impact
            </Link>
            <Link 
              href="/book-appointment" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Book Appointment
            </Link>
            <div
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setResourcesOpen(!resourcesOpen)}
              >
                <span>Resources</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {resourcesOpen && (
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  <Link 
                    href="/blog" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Blog
                  </Link>
                  <Link 
                    href="/case-studies" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Case Studies
                  </Link>
                  <Link 
                    href="/publications" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Publications
                  </Link>
                  <Link 
                    href="/faqs" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    FAQs
                  </Link>
                  <Link 
                    href="/data-insights" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 block dark:text-[#F4F1DE]"
                  >
                    Data Insights
                  </Link>
                </div>
              )}
            </div>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Contact
            </a>
            <Link 
              href="/admin/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors flex items-center gap-2"
            >
              <User size={16} />
              <span>Login / Dashboard</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
