import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertContactMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import Map from "./Map";

const Contact = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false
  });
  const [charCount, setCharCount] = useState(0);

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
        variant: "success",
      });
      // Reset form
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
        consent: false
      });
      setCharCount(0);
    },
    onError: (error: any) => {
      toast({
        title: "Message failed to send",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formState.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to our data processing terms.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form
    submitForm(formState);
  };

  return (
    <section id="contact" className="py-16 bg-white dark:bg-[#333333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4 relative inline-block">
            <span className="relative z-10">Get in Touch</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-[#2A9D8F] opacity-20 -rotate-1"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            Have a question or want to explore how we can help your organization? Reach out to our team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form 
              onSubmit={handleSubmit} 
              className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-6"
            >
              {/* Honeypot field for spam protection */}
              <div className="hidden">
                <input type="text" name="website" id="contact_website" tabIndex={-1} autoComplete="off" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 font-medium dark:text-[#F4F1DE]">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium dark:text-[#F4F1DE]">Email Address</label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  name="email" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block mb-2 font-medium dark:text-[#F4F1DE]">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="services">Services Information</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block mb-2 font-medium dark:text-[#F4F1DE]">
                  Your Message
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    (<span id="charCount">{charCount}</span>/500)
                  </span>
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] dark:bg-[#1A323C] dark:text-[#F4F1DE]"
                  value={formState.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center dark:text-[#F4F1DE] cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="consent" 
                    required 
                    className="mr-2"
                    checked={formState.consent}
                    onChange={handleCheckboxChange}
                  />
                  I consent to ECODATA processing my data to respond to my inquiry.
                </label>
              </div>
              
              <button 
                type="submit" 
                className="w-full px-6 py-3 bg-[#2A9D8F] hover:bg-[#1F7268] text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span>Sending...</span>
                    <div className="ml-2">
                      <i className="fas fa-circle-notch fa-spin"></i>
                    </div>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>
          
          <div>
            <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Our Office</h3>
              <div className="flex items-start mb-4">
                <i className="fas fa-map-marker-alt text-[#2A9D8F] mt-1 mr-3"></i>
                <div>
                  <p className="dark:text-[#F4F1DE]">
                    123 Sustainable Street<br />
                    Eco Quarter<br />
                    London, EC1A 1BB<br />
                    United Kingdom
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <i className="fas fa-envelope text-[#2A9D8F] mr-3"></i>
                <a href="mailto:info@ecodatacic.org" className="hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors">info@ecodatacic.org</a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-[#2A9D8F] mr-3"></i>
                <a href="tel:+442071234567" className="hover:text-[#2A9D8F] dark:text-[#F4F1DE] dark:hover:text-[#38B593] transition-colors">+44 (0) 20 7123 4567</a>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-[#F4F1DE] dark:bg-[#264653] rounded-lg shadow-md overflow-hidden h-72">
              <Map />
            </div>
            
            {/* Social Media Links */}
            <div className="mt-6 flex justify-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center hover:bg-[#2A9D8F] hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center hover:bg-[#2A9D8F] hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center hover:bg-[#2A9D8F] hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center hover:bg-[#2A9D8F] hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
