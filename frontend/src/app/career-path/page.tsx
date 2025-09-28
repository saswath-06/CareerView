"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, ArrowRight, TrendingUp, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export default function CareerPathLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Path Optimization</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get personalized learning roadmaps with courses, projects, and timelines for your career transition.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How to Get Your Career Path</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">1. Upload Your Resume</h3>
                  <p className="text-muted-foreground text-sm">
                    Start by uploading your resume to get AI-powered career matches.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">2. View Career Matches</h3>
                  <p className="text-muted-foreground text-sm">
                    See which careers match your skills and experience.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">3. Get Your Path</h3>
                  <p className="text-muted-foreground text-sm">
                    Click "View Career Path" to get your personalized learning roadmap.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
                <p className="text-muted-foreground mb-6">
                  Upload your resume to get personalized career matches and detailed learning paths.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Target className="w-5 h-5 mr-2" />
                      Upload Resume
                    </Button>
                  </Link>
                  <Link href="/matches">
                    <Button variant="outline" size="lg">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      View Career Matches
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

