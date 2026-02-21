'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { getAnalytics } from '@/lib/analytics/client'
import LeadModal from './LeadModal'

export default function Pricing() {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const analytics = getAnalytics()

  const plans = [
    {
      name: 'Starter',
      price: 99,
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 developers',
        '100 AI completions/month',
        'Basic guardrails',
        'Email support',
        'GitHub integration'
      ]
    },
    {
      name: 'Team',
      price: 299,
      description: 'For growing teams that need more power',
      features: [
        'Up to 20 developers',
        '1,000 AI completions/month',
        'Advanced guardrails',
        'Priority support',
        'All integrations',
        'Audit logs',
        'Custom workflows'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'Custom solutions for large organizations',
      features: [
        'Unlimited developers',
        'Unlimited AI completions',
        'Custom guardrails',
        'Dedicated support',
        'On-premise deployment',
        'SLA guarantees',
        'Custom integrations',
        'Compliance reports'
      ]
    }
  ]

  const handleSelectPlan = (planName: string, price: number | null) => {
    analytics.trackPlanSelect(planName, price || 0)
    setSelectedPlan(planName)
    setShowLeadModal(true)
  }

  return (
    <section data-section-id="pricing" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Early Access Pricing</h2>
          <p className="mt-4 text-lg text-gray-600">
            Special pricing for early adopters. Lock in these rates forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-lg border ${
                plan.popular 
                  ? 'border-blue-600 shadow-lg' 
                  : 'border-gray-200'
              } bg-white`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <div className="mt-6">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="ml-2 text-gray-600">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-gray-900">Custom</div>
                  )}
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.name, plan.price)}
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price ? 'Get Started' : 'Contact Sales'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LeadModal 
        isOpen={showLeadModal} 
        onClose={() => setShowLeadModal(false)}
        preselectedPlan={selectedPlan}
      />
    </section>
  )
}