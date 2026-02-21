import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You for Your Interest!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          We've received your request for early access to Aigine.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </span>
              <p className="ml-3 text-gray-600">
                We'll review your application and reach out within 2-3 business days
              </p>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </span>
              <p className="ml-3 text-gray-600">
                If selected, you'll get access to our beta program with special pricing
              </p>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </span>
              <p className="ml-3 text-gray-600">
                We'll schedule a personalized onboarding session to get you started
              </p>
            </div>
          </div>
        </div>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}