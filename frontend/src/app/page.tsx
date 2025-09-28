"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { Upload, Target, MessageCircle, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function HomePage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadedFile(file)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Connect directly to your existing backend
      const response = await axios.post('http://localhost:8000/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data) {
        // Redirect to career matches page with force refresh
        router.push('/matches?from_upload=true')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      // Handle error - maybe show a toast notification
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            <span className="text-balance">Discover your next</span>
            <br />
            <span className="gradient-text">career path</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-balance">
            Upload your resume and get AI-powered career recommendations with real salary data and personalized
            insights. Talk to career personas before making your move.
          </p>

              <div className="flex justify-center items-center mb-16">
                {isUploading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Processing Your Resume</h3>
                      <p className="text-muted-foreground mb-4">
                        Analyzing your skills and experience to find the best career matches...
                      </p>
                      <div className="w-64 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FileUpload onUpload={handleFileUpload} isUploading={isUploading} />
                )}
              </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Real Salary Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Career Personas</span>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your complete career transition toolkit</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop configuring and start innovating. Discover career paths that match your skills and experience with
              AI-powered insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Career Matching</h3>
                <p className="text-muted-foreground mb-6">
                  Get personalized career recommendations based on your skills and experience with percentage match
                  scores.
                </p>
                <Link href="/matches">
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    Explore matches <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Personas</h3>
                <p className="text-muted-foreground mb-6">
                  Chat with AI versions of professionals in your target roles to understand daily work and career paths.
                </p>
                <Link href="/chat">
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    Start chatting <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Career Insights</h3>
                <p className="text-muted-foreground mb-6">
                  Real salary data and growth projections for your career paths with step-by-step transition plans.
                </p>
                <Link href="/matches">
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    View insights <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to discover your next career?</h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Upload your resume to get started with personalized career recommendations and AI-powered insights.
                  </p>
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Processing Your Resume</h3>
                        <p className="text-muted-foreground mb-4">
                          Analyzing your skills and experience to find the best career matches...
                        </p>
                        <div className="w-64 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <FileUpload onUpload={handleFileUpload} isUploading={isUploading} />
                  )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}