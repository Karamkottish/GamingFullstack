import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/features/landing/HeroSection"
import { FeaturesSection } from "@/features/landing/FeaturesSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
