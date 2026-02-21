'use client'

import { useEffect } from 'react'
import { getAnalytics } from '@/lib/analytics/client'
import HeroV2 from '@/components/landing/HeroV2'
import FeaturesV2 from '@/components/landing/FeaturesV2'
import PricingV2 from '@/components/landing/PricingV2'
import ParticleBackground from '@/components/effects/ParticleBackground'

export default function Home() {
  useEffect(() => {
    // Initialize analytics
    const analytics = getAnalytics()
    
    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <main className="min-h-screen bg-black">
      <ParticleBackground />
      <HeroV2 />
      <FeaturesV2 />
      <PricingV2 />
    </main>
  )
}
