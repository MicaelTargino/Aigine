'use client'

import { FileText, Lock, Server, GitBranch, DollarSign } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: 'Audit Logs',
      description: 'Complete visibility into every action taken by AI agents with detailed audit trails'
    },
    {
      icon: Lock,
      title: 'Guardrails',
      description: 'Built-in safety checks and approval workflows to ensure code quality and security'
    },
    {
      icon: Server,
      title: 'Isolated Runners',
      description: 'Secure, sandboxed execution environments for testing and validation'
    },
    {
      icon: GitBranch,
      title: 'PR Workflow',
      description: 'Seamless integration with your existing Git workflow and review process'
    },
    {
      icon: DollarSign,
      title: 'Cost Controls',
      description: 'Set budgets, monitor usage, and optimize AI resource consumption'
    }
  ]

  return (
    <section data-section-id="features" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Enterprise-Ready Features</h2>
          <p className="mt-4 text-lg text-gray-600">
            Built for teams that need control, visibility, and compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}