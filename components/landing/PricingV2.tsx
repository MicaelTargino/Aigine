'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Rocket } from 'lucide-react'
import { getAnalytics } from '@/lib/analytics/client'
import LeadModalV2 from './LeadModalV2'

export default function PricingV2() {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const analytics = getAnalytics()

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      monthlyPrice: 99,
      yearlyPrice: 79,
      description: 'Perfect for small teams getting started',
      gradient: 'from-blue-600 to-cyan-600',
      features: [
        'Up to 5 developers',
        '100 AI completions/month',
        'Basic guardrails',
        'Email support',
        'GitHub integration',
        'Standard security'
      ],
      notIncluded: ['Custom workflows', 'On-premise deployment', 'SLA guarantees']
    },
    {
      name: 'Team',
      icon: Rocket,
      monthlyPrice: 299,
      yearlyPrice: 249,
      description: 'For growing teams that need more power',
      gradient: 'from-purple-600 to-pink-600',
      popular: true,
      features: [
        'Up to 20 developers',
        '1,000 AI completions/month',
        'Advanced guardrails',
        'Priority support',
        'All integrations',
        'Audit logs',
        'Custom workflows',
        'Advanced analytics'
      ],
      notIncluded: ['On-premise deployment', 'Custom AI models']
    },
    {
      name: 'Enterprise',
      icon: Sparkles,
      monthlyPrice: null,
      yearlyPrice: null,
      description: 'Custom solutions for large organizations',
      gradient: 'from-orange-600 to-red-600',
      features: [
        'Unlimited developers',
        'Unlimited AI completions',
        'Custom guardrails',
        'Dedicated support',
        'On-premise deployment',
        'SLA guarantees',
        'Custom integrations',
        'Compliance reports',
        'Custom AI models',
        'White-glove onboarding'
      ],
      notIncluded: []
    }
  ]

  const handleSelectPlan = (planName: string, price: number | null) => {
    analytics.trackPlanSelect(planName, price || 0)
    setSelectedPlan(planName)
    setShowLeadModal(true)
  }

  return (
    <section data-section-id="pricing" className="relative py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/5 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-white">Simple,</span>{' '}
            <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-1 glass rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-400">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                      <span className="text-xs font-semibold text-white">MOST POPULAR</span>
                    </div>
                  </div>
                )}

                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`relative h-full glass rounded-2xl p-8 ${
                    plan.popular ? 'ring-2 ring-purple-500/50' : ''
                  }`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-2xl`} />
                  
                  <div className="relative">
                    {/* Icon and name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.gradient}`}>
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      {price !== null ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">${price}</span>
                          <span className="text-gray-400">
                            /month{billingPeriod === 'yearly' && ' (billed yearly)'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-5xl font-bold text-white">Custom</div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.button
                      onClick={() => handleSelectPlan(plan.name, price)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                          : 'glass glass-hover text-white'
                      }`}
                    >
                      {price ? 'Get Started' : 'Contact Sales'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-400 mb-8">Trusted by leading engineering teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'].map((badge) => (
              <div key={badge} className="px-6 py-3 glass rounded-lg">
                <span className="text-sm font-medium text-gray-300">{badge} Compliant</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <LeadModalV2 
        isOpen={showLeadModal} 
        onClose={() => setShowLeadModal(false)}
        preselectedPlan={selectedPlan}
      />
    </section>
  )
}