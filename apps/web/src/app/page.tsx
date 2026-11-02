import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DashboardPreview from '@/components/DashboardPreview';
import UnifiedTracking from '@/components/UnifiedTracking';
import AnalyticsInsights from '@/components/AnalyticsInsights';
import Recommendations from '@/components/Recommendations';
import SupportedPlatforms from '@/components/SupportedPlatforms';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <UnifiedTracking />
      <AnalyticsInsights />
      <Recommendations />
      <SupportedPlatforms />
      <FinalCTA />
      <Footer />
    </main>
  );
}