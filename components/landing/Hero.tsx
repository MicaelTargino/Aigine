'use client'

import { useState } from 'react'
import { getAnalytics } from '@/lib/analytics/client'
import LeadModal from './LeadModal'

export default function Hero() {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const analytics = getAnalytics()

  const handlePrimaryCTA = () => {
    analytics.trackCTAClick('request_early_access', 'hero')
    setShowLeadModal(true)
  }

  const handleSecondaryCTA = () => {
    analytics.trackCTAClick('watch_demo', 'hero')
    // Scroll to demo section
    const demoSection = document.querySelector('[data-section-id="demo"]')
    demoSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section data-section-id="hero" className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            AI Agents That Ship
            <span className="block text-blue-600">Production-Ready Code</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Orchestrate intelligent development agents that understand your codebase, 
            write quality code, and handle the entire PR workflow—so your team can focus on what matters.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrimaryCTA}
              className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Request Early Access
            </button>
            <button
              onClick={handleSecondaryCTA}
              className="px-8 py-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
    </section>
  )
}