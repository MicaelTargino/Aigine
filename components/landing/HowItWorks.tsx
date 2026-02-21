'use client'

import { CheckCircle2, GitPullRequest, Shield, Zap } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Zap,
      title: 'Ticket',
      description: 'Create a ticket or issue with requirements'
    },
    {
      icon: CheckCircle2,
      title: 'Dev Agent',
      description: 'AI understands context and writes code'
    },
    {
      icon: Shield,
      title: 'QA Agent',
      description: 'Automated testing and quality checks'
    },
    {
      icon: GitPullRequest,
      title: 'PR',
      description: 'Clean, reviewed pull request ready to merge'
    }
  ]

  return (
    <section data-section-id="how-it-works" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How Aigine Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            From ticket to production in four automated steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 z-0" />
              )}
              <div className="relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow z-10">
                <step.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}