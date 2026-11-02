import React from 'react';

export default function AnalyticsInsights() {
  const mockData = {
    strongTopics: [
      { name: 'Arrays', score: 88 },
      { name: 'Trees', score: 81 },
    ],
    weakTopics: [
      { name: 'Dynamic Programming', score: 54 },
      { name: 'Graphs', score: 61 },
    ],
    improvement: 12,
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Actionable Coding Insights
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            OnePlatform identifies your strengths, weaknesses, and areas for improvement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Strong Topics */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Strong Topics</h3>
              <div className="space-y-4">
                {mockData.strongTopics.map((topic) => (
                  <div key={topic.name} className="flex items-center">
                    <span className="w-32 text-gray-600">{topic.name}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${topic.score}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-gray-600 text-right">{topic.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Topics */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Weak Topics</h3>
              <div className="space-y-4">
                {mockData.weakTopics.map((topic) => (
                  <div key={topic.name} className="flex items-center">
                    <span className="w-32 text-gray-600">{topic.name}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${topic.score}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-gray-600 text-right">{topic.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Insight */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Improvement</h3>
            <p className="text-gray-600">
              Your graph performance improved <span className="font-medium text-green-600">{mockData.improvement}%</span> this month.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}