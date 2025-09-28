'use client'

import { useHydrationFix } from '@/hooks/use-hydration-fix'

export default function HydrationFix() {
  useHydrationFix()
  return null // This component doesn't render anything
}