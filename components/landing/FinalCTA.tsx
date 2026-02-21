'use client'

import { useState } from 'react'
import { getAnalytics } from '@/lib/analytics/client'
import LeadModal from './LeadModal'

export default function FinalCTA() {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const analytics = getAnalytics()

  const handleCTA = () => {
    analytics.trackCTAClick('final_cta', 'final-cta')
    setShowLeadModal(true)
  }

  return (
    <section data-section-id="final-cta" className="bg-gradient-to-r from-blue-600 to-blue-700 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Ship Code 10x Faster?
        </h2>
        <p className="mt-4 text-xl text-blue-100">
          Join the waitlist for early access and lock in special pricing forever.
        </p>
        
        <button
          onClick={handleCTA}
          className="mt-8 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
        >
          Request Early Access Now
        </button>
        
        <p className="mt-4 text-sm text-blue-100">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>

      <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
    </section>
  )
}