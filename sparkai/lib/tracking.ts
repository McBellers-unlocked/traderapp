/**
 * Meta Pixel tracking utilities
 * These events will only fire on web where fbq is available
 */

// Type declaration for fbq
declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Track when a user completes registration
 */
export function trackSignUp(method: 'email' | 'google' | 'apple' = 'email') {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'Parent Account',
      method: method,
    });
  }
}

/**
 * Track when a user adds a child profile
 */
export function trackAddChild() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: 'Child Profile',
      content_type: 'product',
    });
  }
}

/**
 * Track when a user starts their first lesson (free trial)
 */
export function trackStartTrial(lessonId: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'StartTrial', {
      content_name: lessonId,
      content_category: 'Lesson',
    });
  }
}

/**
 * Track when a user completes a lesson
 */
export function trackLessonComplete(lessonId: string, xpEarned: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: `Lesson Complete: ${lessonId}`,
      content_type: 'lesson',
      value: xpEarned,
    });
  }
}

/**
 * Track when a user completes a module
 */
export function trackModuleComplete(moduleId: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AchievementUnlocked', {
      content_name: `Module Complete: ${moduleId}`,
      content_type: 'module',
    });
  }
}

/**
 * Track when a user subscribes to premium
 */
export function trackPurchase(plan: 'monthly' | 'annual', value: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: `Premium ${plan}`,
      content_type: 'subscription',
      value: value,
      currency: 'USD',
    });
  }
}

/**
 * Track when a user initiates checkout
 */
export function trackInitiateCheckout(plan: 'monthly' | 'annual', value: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: `Premium ${plan}`,
      value: value,
      currency: 'USD',
    });
  }
}

/**
 * Track page views (for SPA navigation)
 */
export function trackPageView(pageName: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView', {
      content_name: pageName,
    });
  }
}
