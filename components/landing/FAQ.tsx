'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How does Aigine integrate with our existing workflow?',
      answer: 'Aigine seamlessly integrates with GitHub, GitLab, and Bitbucket. It works alongside your existing CI/CD pipeline and respects your branch protection rules and code review processes.'
    },
    {
      question: 'What languages and frameworks does Aigine support?',
      answer: 'Aigine supports all major programming languages including JavaScript, TypeScript, Python, Java, Go, Ruby, and more. It understands popular frameworks like React, Vue, Django, Spring, and can adapt to your custom tech stack.'
    },
    {
      question: 'How do you ensure code quality and security?',
      answer: 'Every piece of code goes through multiple validation stages including static analysis, security scanning, and automated testing. You can set custom guardrails and approval requirements. All AI actions are logged for complete auditability.'
    },
    {
      question: 'Can we use our own AI models?',
      answer: 'Yes! Enterprise plans support bring-your-own-model (BYOM) deployments. You can use your fine-tuned models or connect to your preferred AI providers while maintaining full control over your data.'
    },
    {
      question: 'What happens to our code and data?',
      answer: 'Your code never leaves your infrastructure in self-hosted deployments. For cloud deployments, all data is encrypted at rest and in transit. We are SOC 2 Type II compliant and never train models on customer code.'
    },
    {
      question: 'How is pricing calculated?',
      answer: 'Pricing is based on the number of developers and AI completions per month. Completions include code generation, reviews, and test creation. Enterprise plans offer unlimited usage with custom pricing.'
    }
  ]

  return (
    <section data-section-id="faq" className="bg-gray-50 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about Aigine
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}