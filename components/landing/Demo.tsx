'use client'

export default function Demo() {
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || ''

  return (
    <section data-section-id="demo" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">See Aigine in Action</h2>
          <p className="mt-4 text-lg text-gray-600">
            Watch how our AI agents collaborate to ship production code
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
            {demoUrl ? (
              <video
                className="w-full h-full"
                controls
                poster="/video-poster.jpg"
              >
                <source src={demoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg">Demo Video Placeholder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}