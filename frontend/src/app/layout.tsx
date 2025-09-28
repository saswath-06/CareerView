import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import HydrationFix from "./hydration-fix"
import HydrationScript from "./script"
import "./globals.css"

export const metadata: Metadata = {
  title: "CareerView - Discover Your Next Career Path",
  description: "AI-powered career transition platform with personalized matches, skill analysis, and career personas",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <HydrationScript />
        <HydrationFix />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}