import React from 'react';

export default function UnifiedTracking() {
  const platforms = [
    {
      name: 'LeetCode',
      features: ['Problems', 'Difficulty', 'Topics'],
      color: 'bg-yellow-500',
    },
    {
      name: 'CodeChef',
      features: ['Problems', 'Contests', 'Rating'],
      color: 'bg-green-600',
    },
    {
      name: 'HackerRank',
      features: ['Challenges', 'Skills', 'Progress'],
      color: 'bg-green-500',
    },
    {
      name: 'Codeforces',
      features: ['Problems', 'Contests', 'Rating'],
      color: 'bg-blue-600',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unified Coding Progress
          </h2>
          <p className="text-xl text-gray-600">
            Combine your activity across all major platforms into a single,
            coherent view of your coding journey.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
          <div className="grid grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-md bg-white w-40 hover:shadow-sm transition-shadow"
              >
                <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                <span className="text-sm font-medium text-gray-900">{platform.name}</span>
              </div>
            ))}
          </div>

          <div className="hidden md:block text-gray-400 font-light text-2xl">→</div>

          <div className="p-8 border border-gray-200 rounded-lg bg-white text-center w-64">
            <div className="text-2xl font-bold text-gray-900 mb-1">OnePlatform</div>
            <div className="text-sm text-gray-500 tracking-wide uppercase font-semibold">
              Unified Tracking
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
