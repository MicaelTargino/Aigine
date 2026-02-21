'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getAnalytics } from '@/lib/analytics/client'
import { useRouter } from 'next/navigation'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedPlan?: string
}

export default function LeadModal({ isOpen, onClose, preselectedPlan }: LeadModalProps) {
  const router = useRouter()
  const analytics = getAnalytics()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    repoSize: '',
    plan: preselectedPlan || '',
    budgetRange: '',
    noBrainerPrice: '',
    urgency: '',
    disappointment: '',
    aiTools: '',
    pain: ''
  })

  useEffect(() => {
    if (preselectedPlan) {
      setFormData(prev => ({ ...prev, plan: preselectedPlan }))
    }
  }, [preselectedPlan])

  useEffect(() => {
    if (isOpen) {
      analytics.trackFormStart('lead_capture')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      analytics.trackFormSubmit('lead_capture')
      
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      router.push('/thanks')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      analytics.trackFormError('lead_capture', 'submission_failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Track form steps
    if (name === 'email' && value) {
      analytics.trackFormStep('lead_capture', 'email_entered')
    } else if (name === 'plan' && value) {
      analytics.trackFormStep('lead_capture', 'plan_selected')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Request Early Access</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g. Engineering Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Size
              </label>
              <select
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="1-5">1-5 developers</option>
                <option value="6-20">6-20 developers</option>
                <option value="21-50">21-50 developers</option>
                <option value="51-100">51-100 developers</option>
                <option value="100+">100+ developers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repository Size
              </label>
              <select
                name="repoSize"
                value={formData.repoSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="small">Small (&lt;100k lines)</option>
                <option value="medium">Medium (100k-1M lines)</option>
                <option value="large">Large (1M+ lines)</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Pricing & Intent</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Which plan are you interested in?
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Starter">Starter ($99/mo)</option>
                  <option value="Team">Team ($299/mo)</option>
                  <option value="Enterprise">Enterprise (Custom)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="<50">&lt;$50/month</option>
                  <option value="50-150">$50-150/month</option>
                  <option value="150-500">$150-500/month</option>
                  <option value="500-2000">$500-2000/month</option>
                  <option value="2000+">$2000+/month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  At what price would this be a no-brainer?
                </label>
                <input
                  type="number"
                  name="noBrainerPrice"
                  value={formData.noBrainerPrice}
                  onChange={handleInputChange}
                  placeholder="$ per month"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  When do you want to start?
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="immediately">Immediately</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              If Aigine disappeared tomorrow, how disappointed would you be?
            </label>
            <select
              name="disappointment"
              value={formData.disappointment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="not">Not disappointed</option>
              <option value="slightly">Slightly disappointed</option>
              <option value="very">Very disappointed</option>
              <option value="extremely">Extremely disappointed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What AI tools are you currently using? (optional)
            </label>
            <input
              type="text"
              name="aiTools"
              value={formData.aiTools}
              onChange={handleInputChange}
              placeholder="e.g. GitHub Copilot, ChatGPT, Cursor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What's your biggest pain point with development today?
            </label>
            <textarea
              name="pain"
              value={formData.pain}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Submitting...' : 'Request Access'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}