'use client'

import { useEffect, useState } from 'react'

export function useHydrationFix() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after client-side rendering
    setIsHydrated(true)
    
    // Remove browser extension attributes that cause hydration mismatches
    const removeExtensionAttributes = () => {
      const body = document.body
      const html = document.documentElement
      
      const extensionAttributes = [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-grammarly-shadow-root',
        'data-grammarly-ignore',
        'data-grammarly-ignore-all',
        'data-grammarly-ignore-grammar',
        'data-grammarly-ignore-spelling',
        'data-grammarly-ignore-punctuation',
        'data-grammarly-ignore-style',
        'data-grammarly-ignore-tone',
        'data-grammarly-ignore-clarity',
        'data-grammarly-ignore-delivery',
        'data-grammarly-ignore-engagement',
        'data-grammarly-ignore-conciseness',
        'data-grammarly-ignore-formality',
        'data-grammarly-ignore-fluency',
        'data-grammarly-ignore-consistency',
        'data-grammarly-ignore-sentiment',
        'data-grammarly-ignore-voice'
      ]
      
      // Remove attributes from body
      extensionAttributes.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr)
        }
      })
      
      // Remove attributes from html element
      extensionAttributes.forEach(attr => {
        if (html.hasAttribute(attr)) {
          html.removeAttribute(attr)
        }
      })
    }
    
    // Run immediately
    removeExtensionAttributes()
    
    // Run again after a short delay to catch any attributes added later
    const timeoutId = setTimeout(removeExtensionAttributes, 100)
    
    // Also run on DOM mutations to catch attributes added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element
          if (target === document.body || target === document.documentElement) {
            removeExtensionAttributes()
          }
        }
      })
    })
    
    observer.observe(document, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
    })
    
    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])

  return isHydrated
}
