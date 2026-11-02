import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm fixed top-0 w-full z-10 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            OnePlatform
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#platforms" className="text-gray-600 hover:text-gray-900 transition-colors">Platforms</Link>
            <Link href="#analytics" className="text-gray-600 hover:text-gray-900 transition-colors">Analytics</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">Get Started</Link>
          </div>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">Menu</button>
          </div>
        </div>
      </div>
    </nav>
  );
}