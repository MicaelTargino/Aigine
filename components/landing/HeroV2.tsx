'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAnalytics } from '@/lib/analytics/client'
import LeadModalV2 from './LeadModalV2'
import { Sparkles, Code2, Zap, ArrowRight, Github, Bot } from 'lucide-react'

export default function HeroV2() {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const analytics = getAnalytics()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handlePrimaryCTA = () => {
    analytics.trackCTAClick('request_early_access', 'hero')
    setShowLeadModal(true)
  }

  const handleSecondaryCTA = () => {
    analytics.trackCTAClick('watch_demo', 'hero')
    const demoSection = document.querySelector('[data-section-id="demo"]')
    demoSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section data-section-id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ left: '10%', top: '20%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-600/30 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ right: '10%', bottom: '20%' }}
        />
      </div>

      {/* Mouse follow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1), transparent 40%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">Powered by Advanced AI</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="text-white">AI Agents That</span>
          <br />
          <span className="text-gradient text-glow">Ship Production Code</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
        >
          Orchestrate intelligent development agents that understand your codebase, 
          write quality code, and handle the entire PR workflow—autonomously.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          {[
            { icon: Code2, text: 'Self-Improving Code' },
            { icon: Bot, text: 'Multi-Agent System' },
            { icon: Github, text: 'Git-Native Workflow' },
            { icon: Zap, text: '10x Faster Shipping' }
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass glass-hover cursor-pointer"
            >
              <feature.icon className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={handlePrimaryCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl 
                     hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 justify-center"
          >
            Request Early Access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            onClick={handleSecondaryCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass glass-hover text-white font-semibold rounded-xl transition-all duration-300"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Floating code snippets */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs text-purple-400/30 font-mono"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                y: [-20, -100],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeOut"
              }}
              style={{
                left: `${20 + i * 15}%`,
                bottom: `${10 + i * 5}%`
              }}
            >
              {['const', 'function', 'async', 'await', 'return'][i]}
            </motion.div>
          ))}
        </div>
      </div>

      <LeadModalV2 isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
    </section>
  )
}