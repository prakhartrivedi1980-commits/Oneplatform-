import React from 'react';

export default function SupportedPlatforms() {
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Supported Coding Platforms
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            OnePlatform integrates with these major coding platforms to provide
            comprehensive coding analytics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900">{platform.name}</h3>
                </div>
                <ul className="space-y-2">
                  {platform.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}