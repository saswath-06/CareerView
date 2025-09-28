'use client'

import Script from 'next/script'

export default function HydrationScript() {
  return (
    <Script
      id="hydration-fix"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // Prevent browser extensions from adding attributes that cause hydration mismatches
          (function() {
            const originalSetAttribute = Element.prototype.setAttribute;
            Element.prototype.setAttribute = function(name, value) {
              // Block common browser extension attributes
              if (name.startsWith('data-grammarly') || 
                  name === 'data-new-gr-c-s-check-loaded' || 
                  name === 'data-gr-ext-installed') {
                return;
              }
              return originalSetAttribute.call(this, name, value);
            };
            
            // Also block on body and html elements specifically
            const body = document.body;
            const html = document.documentElement;
            
            if (body) {
              const bodySetAttribute = body.setAttribute;
              body.setAttribute = function(name, value) {
                if (name.startsWith('data-grammarly') || 
                    name === 'data-new-gr-c-s-check-loaded' || 
                    name === 'data-gr-ext-installed') {
                  return;
                }
                return bodySetAttribute.call(this, name, value);
              };
            }
            
            if (html) {
              const htmlSetAttribute = html.setAttribute;
              html.setAttribute = function(name, value) {
                if (name.startsWith('data-grammarly') || 
                    name === 'data-new-gr-c-s-check-loaded' || 
                    name === 'data-gr-ext-installed') {
                  return;
                }
                return htmlSetAttribute.call(this, name, value);
              };
            }
          })();
        `,
      }}
    />
  )
}

