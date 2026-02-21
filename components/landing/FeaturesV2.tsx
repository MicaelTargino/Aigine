'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  GitBranch, 
  Brain, 
  Lock, 
  BarChart3,
  Code2,
  Workflow,
  Cloud
} from 'lucide-react'

export default function FeaturesV2() {
  const features = [
    {
      icon: Brain,
      title: 'Self-Learning AI',
      description: 'Our agents learn from your codebase patterns and improve with every commit',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption and on-premise deployment options',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: GitBranch,
      title: 'Git-Native Workflow',
      description: 'Seamlessly integrates with your existing Git workflow and CI/CD pipeline',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ship features 10x faster with parallel agent execution and smart caching',
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      icon: Lock,
      title: 'Guardrails & Controls',
      description: 'Set boundaries, approval workflows, and quality gates for all AI actions',
      gradient: 'from-red-600 to-pink-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track productivity gains, code quality metrics, and ROI in real-time',
      gradient: 'from-indigo-600 to-purple-600'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section data-section-id="features" className="relative py-32 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-white">Features That</span>{' '}
            <span className="text-gradient">Empower Teams</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to accelerate development while maintaining control and visibility
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                   style={{
                     backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                     '--tw-gradient-from': feature.gradient.split(' ')[1],
                     '--tw-gradient-to': feature.gradient.split(' ')[3],
                   } as any}
              />
              
              <div className="relative glass rounded-2xl p-8 h-full">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive demo section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20"
        >
          <div className="relative glass rounded-2xl p-8 lg:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl" />
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-white mb-4">
                See It In Action
              </h3>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Watch how our AI agents collaborate to transform a simple ticket into production-ready code with tests, documentation, and a clean PR.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  Watch Live Demo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 glass glass-hover text-white font-medium rounded-lg transition-all duration-300"
                >
                  Try Interactive Playground
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}