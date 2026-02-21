'use client'

import { nanoid } from 'nanoid'

interface EventPayload {
  type: string
  path?: string
  sectionId?: string
  payload?: Record<string, any>
  timestamp?: number
}

interface ClickEvent {
  x_norm: number
  y_norm: number
  viewport_w: number
  viewport_h: number
  page_path: string
  section_id?: string
  element_tag?: string
}

class AnalyticsClient {
  private queue: EventPayload[] = []
  private visitorId: string
  private sessionId: string
  private flushInterval: NodeJS.Timeout | null = null
  private maxQueueSize = 10
  private flushIntervalMs = 5000
  private scrollDepth = 0
  private sectionObserver: IntersectionObserver | null = null
  private sectionTimings: Map<string, { firstSeen: number; totalVisible: number; lastEntry: number }> = new Map()

  constructor() {
    this.visitorId = this.getOrCreateVisitorId()
    this.sessionId = this.getOrCreateSessionId()
    
    if (typeof window !== 'undefined') {
      this.initializeTracking()
    }
  }

  private getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') return ''
    
    const cookieName = 'vid'
    const cookies = document.cookie.split(';')
    const vidCookie = cookies.find(c => c.trim().startsWith(`${cookieName}=`))
    
    if (vidCookie) {
      return vidCookie.split('=')[1]
    }
    
    const vid = nanoid()
    const maxAge = 365 * 24 * 60 * 60 // 1 year
    document.cookie = `${cookieName}=${vid}; max-age=${maxAge}; path=/; SameSite=Strict`
    return vid
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    const cookieName = 'sid'
    const cookies = document.cookie.split(';')
    const sidCookie = cookies.find(c => c.trim().startsWith(`${cookieName}=`))
    
    if (sidCookie) {
      return sidCookie.split('=')[1]
    }
    
    const sid = nanoid()
    const maxAge = 30 * 60 // 30 minutes
    document.cookie = `${cookieName}=${sid}; max-age=${maxAge}; path=/; SameSite=Strict`
    return sid
  }

  private initializeTracking() {
    // Check for bots
    if (this.isBot()) {
      console.log('Bot detected, analytics disabled')
      return
    }

    // Start flush interval
    this.startFlushInterval()

    // Track page view
    this.trackPageView()

    // Track scroll depth
    this.trackScrollDepth()

    // Track section visibility
    this.trackSectionVisibility()

    // Track all clicks for heatmap
    this.trackClicks()

    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush())
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.flush()
    })
  }

  private isBot(): boolean {
    if (typeof navigator === 'undefined') return false
    
    // Check for webdriver
    if ((navigator as any).webdriver === true) return true
    
    // Check user agent for common bots
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i, /facebookexternalhit/i,
      /whatsapp/i, /slack/i, /telegram/i, /discord/i
    ]
    
    return botPatterns.some(pattern => pattern.test(navigator.userAgent))
  }

  private startFlushInterval() {
    this.flushInterval = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush()
      }
    }, this.flushIntervalMs)
  }

  private trackPageView() {
    this.track({
      type: 'page_view',
      path: window.location.pathname,
      payload: {
        url: window.location.href,
        referrer: document.referrer,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        user_agent: navigator.userAgent
      }
    })
  }

  private trackScrollDepth() {
    let ticking = false
    
    const updateScrollDepth = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)
      
      if (scrollPercent > this.scrollDepth) {
        this.scrollDepth = scrollPercent
        
        // Track milestone depths
        const milestones = [25, 50, 75, 90, 100]
        milestones.forEach(milestone => {
          if (this.scrollDepth >= milestone && this.scrollDepth - scrollPercent < milestone) {
            this.track({
              type: 'scroll_depth',
              path: window.location.pathname,
              payload: {
                depth: milestone,
                max_depth: this.scrollDepth
              }
            })
          }
        })
      }
      
      ticking = false
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth)
        ticking = true
      }
    })
  }

  private trackSectionVisibility() {
    const sections = document.querySelectorAll('[data-section-id]')
    
    if (sections.length === 0) return
    
    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = (entry.target as HTMLElement).dataset.sectionId!
        const now = Date.now()
        
        if (entry.isIntersecting) {
          if (!this.sectionTimings.has(sectionId)) {
            this.sectionTimings.set(sectionId, {
              firstSeen: now,
              totalVisible: 0,
              lastEntry: now
            })
            
            // Track first view
            this.track({
              type: 'section_view',
              sectionId,
              path: window.location.pathname,
              payload: {
                first_seen: true
              }
            })
          } else {
            const timing = this.sectionTimings.get(sectionId)!
            timing.lastEntry = now
          }
        } else {
          const timing = this.sectionTimings.get(sectionId)
          if (timing && timing.lastEntry > 0) {
            timing.totalVisible += now - timing.lastEntry
            timing.lastEntry = 0
            
            // Track accumulated view time
            this.track({
              type: 'section_view',
              sectionId,
              path: window.location.pathname,
              payload: {
                visible_ms: timing.totalVisible
              }
            })
          }
        }
      })
    }, {
      threshold: 0.5 // Section is considered visible when 50% is in viewport
    })
    
    sections.forEach(section => {
      this.sectionObserver!.observe(section)
    })
  }

  private trackClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const x = event.clientX
      const y = event.clientY + window.scrollY
      
      const clickData: ClickEvent = {
        x_norm: x / document.documentElement.scrollWidth,
        y_norm: y / document.documentElement.scrollHeight,
        viewport_w: window.innerWidth,
        viewport_h: window.innerHeight,
        page_path: window.location.pathname,
        element_tag: target.tagName.toLowerCase()
      }
      
      // Get section if available
      const section = target.closest('[data-section-id]') as HTMLElement
      if (section) {
        clickData.section_id = section.dataset.sectionId
      }
      
      this.track({
        type: 'click',
        path: window.location.pathname,
        sectionId: clickData.section_id,
        payload: clickData
      })
    })
  }

  track(event: EventPayload) {
    if (this.isBot()) return
    
    this.queue.push({
      ...event,
      timestamp: Date.now()
    })
    
    if (this.queue.length >= this.maxQueueSize) {
      this.flush()
    }
  }

  trackCTAClick(ctaName: string, sectionId?: string) {
    this.track({
      type: 'cta_click',
      sectionId,
      path: window.location.pathname,
      payload: {
        cta_name: ctaName
      }
    })
  }

  trackPlanSelect(planName: string, price: number) {
    this.track({
      type: 'plan_select',
      path: window.location.pathname,
      payload: {
        plan_name: planName,
        price_shown: price
      }
    })
  }

  trackFormStart(formName: string) {
    this.track({
      type: 'form_start',
      path: window.location.pathname,
      payload: {
        form_name: formName
      }
    })
  }

  trackFormStep(formName: string, step: string) {
    this.track({
      type: 'form_step',
      path: window.location.pathname,
      payload: {
        form_name: formName,
        step
      }
    })
  }

  trackFormSubmit(formName: string) {
    this.track({
      type: 'form_submit',
      path: window.location.pathname,
      payload: {
        form_name: formName
      }
    })
  }

  trackFormError(formName: string, error: string) {
    this.track({
      type: 'form_error',
      path: window.location.pathname,
      payload: {
        form_name: formName,
        error
      }
    })
  }

  private async flush() {
    if (this.queue.length === 0) return
    
    const events = [...this.queue]
    this.queue = []
    
    try {
      const payload = {
        vid: this.visitorId,
        sid: this.sessionId,
        events
      }
      
      // Use sendBeacon if available and page is unloading
      if (typeof navigator !== 'undefined' && navigator.sendBeacon && document.hidden) {
        navigator.sendBeacon('/api/track', JSON.stringify(payload))
      } else {
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }
    } catch (error) {
      console.error('Failed to send analytics:', error)
      // Re-queue events on failure
      this.queue = [...events, ...this.queue]
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    if (this.sectionObserver) {
      this.sectionObserver.disconnect()
    }
    this.flush()
  }
}

// Singleton instance
let analyticsInstance: AnalyticsClient | null = null

export function getAnalytics(): AnalyticsClient {
  if (!analyticsInstance && typeof window !== 'undefined') {
    analyticsInstance = new AnalyticsClient()
  }
  return analyticsInstance!
}

export { AnalyticsClient }