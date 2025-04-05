import { useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/components/ThemeProvider";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#333333] shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
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
          <a 
            href="#services" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Services
          </a>
          <a 
            href="#technology" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Technology
          </a>
          <a 
            href="#impact" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Impact
          </a>
          <Link 
            href="/blog" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Blog
          </Link>
          <a 
            href="#contact" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Contact
          </a>
          <Link 
            href="/spinner-demo" 
            className="font-medium hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors"
          >
            Spinners
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
              onClick={() => setMobileMenuOpen(false)}
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
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Services
            </a>
            <a 
              href="#technology" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Technology
            </a>
            <a 
              href="#impact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Impact
            </a>
            <Link 
              href="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Blog
            </Link>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Contact
            </a>
            <Link 
              href="/spinner-demo" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-[#F4F1DE] dark:hover:bg-[#1A323C] dark:text-white rounded transition-colors"
            >
              Spinners
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
