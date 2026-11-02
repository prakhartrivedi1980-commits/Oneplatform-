import React from 'react';

export default function FinalCTA() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
            Your coding progress deserves one clear view.
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Connect your coding profiles, understand your progress, and know what to improve next.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition">
              Get Started
            </button>
            <button className="border border-gray-300 text-gray-900 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition">
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}