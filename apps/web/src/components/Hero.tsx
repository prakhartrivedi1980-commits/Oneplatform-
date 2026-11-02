import React from 'react';

export default function Hero() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Coding Progress
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            OnePlatform unifies your coding progress across LeetCode, CodeChef, HackerRank, and Codeforces
            into a single powerful analytics dashboard.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition">
              Get Started
            </button>
            <button className="border border-gray-300 text-gray-900 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}