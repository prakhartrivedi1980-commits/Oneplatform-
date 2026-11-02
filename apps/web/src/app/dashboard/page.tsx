import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">OnePlatform</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-xl text-gray-600 mb-8">
            You&apos;re signed in to OnePlatform.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <p className="text-gray-700">
              This is a temporary placeholder. The full coding analytics dashboard will be built later.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Home
            </Link>
            <LogoutButton className="mt-4 sm:mt-0" />
          </div>
        </div>
      </div>
    </div>
  );
}