import React from 'react';

export default function DashboardPreview() {
  const mockData = {
    problemsSolved: 487,
    currentStreak: 18,
    activePlatforms: 4,
    goalProgress: 72,
    difficulty: {
      easy: 214,
      medium: 201,
      hard: 72,
    },
    topics: [
      { name: 'Arrays', progress: 85 },
      { name: 'Dynamic Programming', progress: 72 },
      { name: 'Trees', progress: 68 },
      { name: 'Graphs', progress: 55 },
    ],
    platforms: ['LeetCode', 'CodeChef', 'HackerRank', 'Codeforces'],
    recentActivity: [
      { problem: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', date: '2 days ago' },
      { problem: 'Longest Substring', difficulty: 'Medium', platform: 'CodeChef', date: '3 days ago' },
      { problem: 'Binary Tree Traversal', difficulty: 'Medium', platform: 'HackerRank', date: '5 days ago' },
      { problem: 'Dijkstra Algorithm', difficulty: 'Hard', platform: 'Codeforces', date: '6 days ago' },
    ],
    activityData: [
      { day: 'Mon', count: 3 },
      { day: 'Tue', count: 5 },
      { day: 'Wed', count: 2 },
      { day: 'Thu', count: 7 },
      { day: 'Fri', count: 4 },
      { day: 'Sat', count: 6 },
      { day: 'Sun', count: 3 },
    ],
  };

  // Calculate max activity for chart scaling
  const maxActivity = Math.max(...mockData.activityData.map(item => item.count));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Coding Analytics Dashboard
          </h2>
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-white border-r border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h3>
                <nav className="space-y-4">
                  <a href="#" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md bg-gray-100">Overview</a>
                  <a href="#" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Progress</a>
                  <a href="#" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Activity</a>
                  <a href="#" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Analytics</a>
                  <a href="#" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Goals</a>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-white p-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500">Problems Solved</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{mockData.problemsSolved}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500">Current Streak</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{mockData.currentStreak} days</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500">Active Platforms</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{mockData.activePlatforms}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500">Goal Progress</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{mockData.goalProgress}%</p>
                  </div>
                </div>

                {/* Activity Chart */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
                    <div className="h-40">
                      <svg className="w-full h-full" viewBox="0 0 400 160">
                        {/* Grid lines */}
                        <path d="M0,140 L400,140" stroke="#E5E7EB" strokeWidth="1" />
                        <path d="M0,100 L400,100" stroke="#E5E7EB" strokeWidth="1" />
                        <path d="M0,60 L400,60" stroke="#E5E7EB" strokeWidth="1" />
                        <path d="M0,20 L400,20" stroke="#E5E7EB" strokeWidth="1" />

                        {/* X-axis labels */}
                        {mockData.activityData.map((item, index) => (
                          <text
                            key={`label-${index}`}
                            x={index * 50 + 25}
                            y="150"
                            textAnchor="middle"
                            className="text-xs fill-gray-500"
                          >
                            {item.day}
                          </text>
                        ))}

                        {/* Bars */}
                        {mockData.activityData.map((item, index) => (
                          <rect
                            key={`bar-${index}`}
                            x={index * 50 + 10}
                            y={140 - (item.count / maxActivity) * 120}
                            width="30"
                            height={(item.count / maxActivity) * 120}
                            fill="#3B82F6"
                            rx="2"
                          />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Breakdown</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <h4 className="text-sm font-medium text-green-700">Easy</h4>
                      <p className="text-xl font-bold text-green-900 mt-1">{mockData.difficulty.easy}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                      <h4 className="text-sm font-medium text-yellow-700">Medium</h4>
                      <p className="text-xl font-bold text-yellow-900 mt-1">{mockData.difficulty.medium}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-md border border-red-100">
                      <h4 className="text-sm font-medium text-red-700">Hard</h4>
                      <p className="text-xl font-bold text-red-900 mt-1">{mockData.difficulty.hard}</p>
                    </div>
                  </div>
                </div>

                {/* Topic Performance */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance</h3>
                  <div className="space-y-3">
                    {mockData.topics.map((topic) => (
                      <div key={topic.name} className="flex items-center">
                        <span className="w-32 text-sm text-gray-600">{topic.name}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${topic.progress}%` }}
                          ></div>
                        </div>
                        <span className="w-10 text-sm text-gray-600 text-right">{topic.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connected Platforms */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockData.platforms.map((platform) => (
                      <span key={platform} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full border border-gray-200">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.problem}</p>
                          <p className="text-sm text-gray-500">
                            {activity.difficulty} • {activity.platform}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}