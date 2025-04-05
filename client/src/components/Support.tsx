import React from 'react';
import DonateButton from './DonateButton';
import { HeartHandshake, Shield, LineChart } from 'lucide-react';

const Support = () => {
  return (
    <section id="support" className="py-16 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
          <p className="mb-8 text-lg">
            Your donation helps us continue our work to deliver sustainable data solutions and 
            environmental impact research. Every contribution, no matter how small, 
            makes a difference in our ability to create positive change.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Make a Donation</h3>
            <p className="mb-6">
              Your generosity allows us to expand our research initiatives, 
              develop new sustainability metrics, and provide data-driven 
              solutions to environmental challenges.
            </p>
            
            {/* Benefits of donating */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <HeartHandshake className="h-8 w-8 text-emerald-500 mb-2" />
                <h4 className="font-medium text-sm mb-1">Support Communities</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">Help fund social impact initiatives</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Shield className="h-8 w-8 text-emerald-500 mb-2" />
                <h4 className="font-medium text-sm mb-1">Protect Environment</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">Support sustainability research</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <LineChart className="h-8 w-8 text-emerald-500 mb-2" />
                <h4 className="font-medium text-sm mb-1">Drive Innovation</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">Help develop new data tools</p>
              </div>
            </div>
            
            <div className="mt-6 mb-4">
              <DonateButton />
            </div>
            
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
              <p>
                All donations are secure and encrypted through Stripe payment processing.
              </p>
              <p>
                ECODATA CIC is a registered Community Interest Company in the United Kingdom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;