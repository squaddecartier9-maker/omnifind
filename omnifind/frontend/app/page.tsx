import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/layout/HeroSection'
import { SearchSection } from '@/components/search/SearchSection'
import { StatsBar } from '@/components/layout/StatsBar'
import { HowItWorks } from '@/components/layout/HowItWorks'
import { PricingSection } from '@/components/layout/PricingSection'
import { GrowthSection } from '@/components/layout/GrowthSection'
import { FooterCTA } from '@/components/layout/FooterCTA'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SearchSection />
      <StatsBar />
      <div className="bg-white text-gray-900">
        <HowItWorks />
        <PricingSection />
        <GrowthSection />
      </div>
      <FooterCTA />
    </main>
  )
}
