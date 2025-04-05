import React from 'react';
import DonateButton from './DonateButton';

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
            
            <div className="flex justify-center">
              <DonateButton />
            </div>
            
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              All donations are secure and encrypted. ECODATA CIC is a registered 
              Community Interest Company in the United Kingdom.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;