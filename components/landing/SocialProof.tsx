export default function SocialProof() {
  const companies = [
    'TechCorp', 'StartupCo', 'DevTools Inc', 'CloudScale', 'DataFlow', 'AppBuilders'
  ]

  return (
    <section data-section-id="social-proof" className="bg-white py-12 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 mb-6">
          TRUSTED BY ENGINEERING TEAMS AT
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {companies.map((company) => (
            <div 
              key={company}
              className="h-10 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-600 font-medium"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}