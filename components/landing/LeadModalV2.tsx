'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight, User, Mail, Building, Briefcase } from 'lucide-react'
import { getAnalytics } from '@/lib/analytics/client'
import { useRouter } from 'next/navigation'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedPlan?: string
}

export default function LeadModalV2({ isOpen, onClose, preselectedPlan }: LeadModalProps) {
  const router = useRouter()
  const analytics = getAnalytics()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  
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
      setCurrentStep(1)
    }
  }, [isOpen])

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
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      analytics.trackFormStep('lead_capture', `step_${currentStep + 1}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-600/20">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Request Early Access</h2>
                    <p className="text-sm text-gray-400">Step {currentStep} of 3</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                   text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                                   transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                   text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                                   transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Company name"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                   text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                                   transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          placeholder="Your role"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                   text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                                   transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="" className="bg-black">Team size</option>
                        <option value="1-5" className="bg-black">1-5 developers</option>
                        <option value="6-20" className="bg-black">6-20 developers</option>
                        <option value="21-50" className="bg-black">21-50 developers</option>
                        <option value="51-100" className="bg-black">51-100 developers</option>
                        <option value="100+" className="bg-black">100+ developers</option>
                      </select>

                      <select
                        name="repoSize"
                        value={formData.repoSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="" className="bg-black">Repository size</option>
                        <option value="small" className="bg-black">Small (&lt;100k lines)</option>
                        <option value="medium" className="bg-black">Medium (100k-1M lines)</option>
                        <option value="large" className="bg-black">Large (1M+ lines)</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Pricing Intent */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        name="plan"
                        value={formData.plan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="" className="bg-black">Select a plan</option>
                        <option value="Starter" className="bg-black">Starter ($99/mo)</option>
                        <option value="Team" className="bg-black">Team ($299/mo)</option>
                        <option value="Enterprise" className="bg-black">Enterprise (Custom)</option>
                      </select>

                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="" className="bg-black">Budget range</option>
                        <option value="<50" className="bg-black">&lt;$50/month</option>
                        <option value="50-150" className="bg-black">$50-150/month</option>
                        <option value="150-500" className="bg-black">$150-500/month</option>
                        <option value="500-2000" className="bg-black">$500-2000/month</option>
                        <option value="2000+" className="bg-black">$2000+/month</option>
                      </select>

                      <input
                        type="number"
                        name="noBrainerPrice"
                        value={formData.noBrainerPrice}
                        onChange={handleInputChange}
                        placeholder="No-brainer price ($/month)"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                                 transition-colors"
                      />

                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                                 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="" className="bg-black">When to start?</option>
                        <option value="immediately" className="bg-black">Immediately</option>
                        <option value="1-3months" className="bg-black">1-3 months</option>
                        <option value="exploring" className="bg-black">Just exploring</option>
                      </select>
                    </div>

                    <select
                      name="disappointment"
                      value={formData.disappointment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                               text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="" className="bg-black">If Aigine disappeared, I'd be...</option>
                      <option value="not" className="bg-black">Not disappointed</option>
                      <option value="slightly" className="bg-black">Slightly disappointed</option>
                      <option value="very" className="bg-black">Very disappointed</option>
                      <option value="extremely" className="bg-black">Extremely disappointed</option>
                    </select>
                  </motion.div>
                )}

                {/* Step 3: Additional Info */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      name="aiTools"
                      value={formData.aiTools}
                      onChange={handleInputChange}
                      placeholder="Current AI tools (e.g., Copilot, ChatGPT)"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                               transition-colors"
                    />

                    <textarea
                      name="pain"
                      value={formData.pain}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="What's your biggest development pain point?"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                               transition-colors resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 glass glass-hover text-white font-medium rounded-lg transition-colors"
                  >
                    Back
                  </button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                               font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/50 
                               transition-all duration-300 flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                               font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/50 
                               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Request Access'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}