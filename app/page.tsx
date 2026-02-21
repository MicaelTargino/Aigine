'use client'

import { useEffect } from 'react'
import { getAnalytics } from '@/lib/analytics/client'
import Hero from '@/components/landing/Hero'
import SocialProof from '@/components/landing/SocialProof'
import HowItWorks from '@/components/landing/HowItWorks'
import Demo from '@/components/landing/Demo'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'

export default function Home() {
  useEffect(() => {
    // Initialize analytics
    const analytics = getAnalytics()
    
    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Demo />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  )
}
