import { Calendar, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const BookAppointment = () => {
  // Microsoft Teams meeting booking link
  // This would ideally be a URL from your Microsoft Bookings or Teams calendar
  const teamsBookingUrl = "https://outlook.office.com/bookwithme/user";
  
  return (
    <section id="book-appointment" className="py-16 bg-[#F4F1DE] dark:bg-[#1A323C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4 relative inline-block">
            <span className="relative z-10">Book an Appointment</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-[#2A9D8F] opacity-20 -rotate-1"></span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-[#F4F1DE]">
            Schedule a consultation with our team to discuss your project needs and how we can help.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#264653] rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Left side with info */}
              <div className="md:col-span-2 p-8 bg-[#264653] text-white">
                <h3 className="text-xl font-semibold mb-6">Why Book With Us?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 text-[#2A9D8F] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Flexible Scheduling</h4>
                      <p className="text-sm text-gray-200">Choose a time that works best for your schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-[#2A9D8F] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">30-Minute Consultations</h4>
                      <p className="text-sm text-gray-200">Brief but productive initial meetings to discuss your needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-6 w-6 text-[#2A9D8F] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Expert Guidance</h4>
                      <p className="text-sm text-gray-200">Meet with specialists who understand your sector</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side with CTA */}
              <div className="md:col-span-3 p-8 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4 dark:text-[#F4F1DE]">Ready to get started?</h3>
                <p className="mb-8 dark:text-[#F4F1DE]">
                  Click below to access our Microsoft Teams booking calendar. Select a date 
                  and time that works for you, and we'll confirm your appointment via email.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <a 
                    href={teamsBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-4 bg-[#2A9D8F] hover:bg-[#1F7268] text-white font-medium rounded-lg transition-colors shadow-md"
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 2228.833 2073.333"
                    >
                      <path 
                        fill="#fff" 
                        d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483c0,0,0,0,0,0v524.398  c0,199.901-162.124,362.024-362.024,362.024h0H1554.637V777.5z" 
                      />
                      <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25" />
                      <circle fill="#5059C9" cx="1218.083" cy="336.917" r="336.917" />
                      <path 
                        fill="#7B83EB" 
                        d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-95.01,99.676v598.105  c-7.505,322.519,247.657,590.16,570.167,598.053c322.51-7.893,577.671-275.534,570.167-598.053V877.176  C1763.58,823.431,1721.066,778.83,1667.323,777.5z"
                      />
                      <path 
                        opacity=".1" 
                        d="M1244,777.5v838.145c-0.258,38.435-23.549,72.964-59.09,87.598  c-11.316,4.787-23.478,7.254-35.765,7.257H667.613c-6.738-17.105-12.958-34.21-18.142-51.833  c-18.144-59.477-27.402-121.307-27.472-183.49V877.02c-1.246-53.659,41.198-98.19,94.855-99.52H1244z"
                      />
                      <path 
                        opacity=".2" 
                        d="M1192.167,777.5v889.978c-0.002,12.287-2.47,24.449-7.257,35.765  c-14.634,35.541-49.163,58.833-87.598,59.09H691.975c-8.812-17.105-17.105-34.21-24.362-51.833  c-7.257-17.623-12.958-34.21-18.142-51.833c-18.144-59.477-27.402-121.307-27.472-183.49V877.02  c-1.246-53.659,41.198-98.19,94.855-99.52H1192.167z"
                      />
                      <path 
                        opacity=".2" 
                        d="M1192.167,777.5v786.312c-0.395,52.223-42.632,94.46-94.855,94.855h-447.24  c-18.144-59.477-27.402-121.307-27.472-183.49V877.02c-1.246-53.659,41.198-98.19,94.855-99.52H1192.167z"
                      />
                      <path 
                        opacity=".2" 
                        d="M1140.333,777.5v786.312c-0.395,52.223-42.632,94.46-94.855,94.855H667.613  c-18.144-59.477-27.402-121.307-27.472-183.49V877.02c-1.246-53.659,41.198-98.19,94.855-99.52H1140.333z"
                      />
                      <path 
                        opacity=".1" 
                        d="M1244,509.522v163.275c-8.812,0.518-17.105,1.037-25.917,1.037  c-8.812,0-17.105-0.518-25.917-1.037c-17.496-1.161-34.848-3.937-51.833-8.293c-104.963-24.857-191.679-98.469-233.25-198.003  c-7.153-16.715-12.706-34.071-16.587-51.833h258.648C1201.449,414.866,1243.801,457.217,1244,509.522z"
                      />
                      <path 
                        opacity=".2" 
                        d="M1192.167,561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293  c-104.963-24.857-191.679-98.469-233.25-198.003h190.228C1149.616,466.699,1191.968,509.051,1192.167,561.355z"
                      />
                      <path 
                        opacity=".2" 
                        d="M1192.167,561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293  c-104.963-24.857-191.679-98.469-233.25-198.003h190.228C1149.616,466.699,1191.968,509.051,1192.167,561.355z"
                      />
                      <path 
                        opacity=".2" 
                        d="M1140.333,561.355v103.148c-104.963-24.857-191.679-98.469-233.25-198.003h138.395  C1097.783,466.699,1140.134,509.051,1140.333,561.355z"
                      />
                      <linearGradient 
                        id="teamsPrimaryLinearGradient" 
                        gradientUnits="userSpaceOnUse" 
                        x1="198.099" 
                        y1="1683.0726" 
                        x2="942.2344" 
                        y2="394.2607" 
                        gradientTransform="matrix(1 0 0 -1 0 2075.3333)"
                      >
                        <stop offset="0" style={{stopColor: "#5A62C3"}} />
                        <stop offset=".5" style={{stopColor: "#4D55BD"}} />
                        <stop offset="1" style={{stopColor: "#3940AB"}} />
                      </linearGradient>
                      <path 
                        fill="url(#teamsPrimaryLinearGradient)" 
                        d="M95.01,777.5h950.312c52.473,0,95.01,42.538,95.01,95.01v950.312  c0,52.473-42.538,95.01-95.01,95.01H95.01c-52.473,0-95.01-42.538-95.01-95.01V872.51C0,820.038,42.538,777.5,95.01,777.5z"
                      />
                      <path 
                        fill="#FFF" 
                        d="M820.211,1273.92H618.053v-202.25h202.158c5.197,0,9.412,4.215,9.412,9.412v183.427  C829.623,1269.705,825.408,1273.92,820.211,1273.92z M618.053,1095.545h-269.37c-5.197,0-9.412-4.215-9.412-9.412V902.705  c0-5.197,4.215-9.412,9.412-9.412h269.37V1095.545z M348.683,1120.67h269.37v153.25h-269.37c-5.197,0-9.412-4.215-9.412-9.412  v-134.427C339.27,1124.885,343.485,1120.67,348.683,1120.67z"
                      />
                    </svg>
                    Book via Microsoft Teams
                  </a>
                </motion.div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-6">
                  No Microsoft account? <a href="/#contact" className="text-[#2A9D8F] hover:underline">Contact us</a> directly and we'll arrange an appointment for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookAppointment;