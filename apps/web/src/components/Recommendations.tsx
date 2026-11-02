import React from 'react';

export default function Recommendations() {
  const mockRecommendations = [
    {
      topic: 'Dynamic Programming',
      status: 'Below average',
      detail: 'Your solve rate is below your overall average.',
      recommendation: 'Practice 5 medium DP problems.',
    },
    {
      topic: 'Graphs',
      status: 'Improving but weak',
      detail: 'Consistency has improved, but advanced traversal problems remain weak.',
      recommendation: 'Review BFS/DFS patterns.',
    },
    {
      topic: 'Arrays',
      status: 'Strong',
      detail: 'Strongest topic.',
      recommendation: 'Maintain performance with occasional harder problems.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Know What to Work On Next
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            OnePlatform analyzes your coding patterns to provide personalized recommendations.
          </p>

          <div className="space-y-6">
            {mockRecommendations.map((recommendation, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{recommendation.topic}</h3>
                    <p className="text-sm text-gray-500 mt-1">Status: {recommendation.status}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  {recommendation.detail}
                </p>
                <p className="text-gray-700 font-medium">
                  {recommendation.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}