import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">OnePlatform</h3>
            <p className="text-gray-600">
              Unified coding progress and analytics for students.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Analytics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Platforms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Recommendations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Platforms</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">LeetCode</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">CodeChef</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">HackerRank</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Codeforces</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© OnePlatform. Empowering students to master coding progress.</p>
        </div>
      </div>
    </footer>
  );
}