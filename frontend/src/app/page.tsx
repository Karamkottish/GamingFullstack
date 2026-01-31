import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/features/landing/HeroSection"
import { FeaturesSection } from "@/features/landing/FeaturesSection"
import { SolutionsSection } from "@/features/landing/SolutionsSection"
import { PricingSection } from "@/features/landing/PricingSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SolutionsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
