"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Target,
  Phone,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"
// Removed voice chat - now in persona chat pages

interface CareerMatch {
  id?: number
  career_id?: string
  title: string
  match_percentage?: number
  matchPercentage?: number
  description: string
  matched_skills?: string[]
  missing_skills?: string[]
  salary_range?: string
  growth_outlook?: string
  why_good_fit?: string
  next_steps?: string[]
}

interface UserProfile {
  name: string
  currentRole: string
  experience: string
  topSkills: string[]
}


export default function CareerMatchesPage() {
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Removed voice chat state - now in persona chat pages
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchCareerMatches = async () => {
      try {
        setLoading(true)
        
        // Clear any cached data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('career_matches')
          localStorage.removeItem('user_profile')
        }
        
        // For now, we'll use a hardcoded user ID, but in a real app this would come from auth
        const userId = "user123"
        
        // Check if we're coming from upload (force refresh)
        const fromUpload = searchParams.get('from_upload') === 'true'
        const forceRefresh = fromUpload || searchParams.get('force_refresh') === 'true'
        
        // Add force_refresh parameter and timestamp to ensure we get fresh data
        const timestamp = Date.now()
        const url = forceRefresh 
          ? `http://localhost:8000/career-matches/${userId}?force_refresh=true&t=${timestamp}`
          : `http://localhost:8000/career-matches/${userId}?t=${timestamp}`
        
        const response = await axios.get(url)
        
        console.log("Backend response:", response.data) // Debug log
        
        // The backend returns the matches directly, not wrapped in a 'matches' field
        if (response.data && Array.isArray(response.data)) {
          setCareerMatches(response.data)
          setUserProfile({
            name: "User", // This would come from auth in a real app
            currentRole: "Current Role",
            experience: "0 years",
            topSkills: []
          })
        } else if (response.data.matches) {
          setCareerMatches(response.data.matches)
          setUserProfile({
            name: response.data.user_profile?.name || "User",
            currentRole: "Current Role",
            experience: `${response.data.user_profile?.experience_years || 0} years`,
            topSkills: response.data.user_profile?.top_skills || []
          })
        } else {
          setError("Failed to fetch career matches")
        }
      } catch (error) {
        console.error('Error fetching career matches:', error)
        setError("Failed to load career matches. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCareerMatches()
  }, [])

      if (loading) {
        return (
          <div className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <Link href="/">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <h1 className="text-3xl font-bold">Your Career Matches</h1>
                </div>
                
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">Loading Career Matches</h2>
                    <p className="text-muted-foreground max-w-md">
                      Analyzing your resume and finding the best career opportunities for you...
                    </p>
                  </div>
                  
                  <div className="w-full max-w-md">
                    <div className="bg-muted rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">This may take a few moments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Matches</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Career Matches</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Based on your skills and experience, here are the career paths that align best with your profile.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{userProfile?.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{userProfile?.currentRole || "Current Role"}</p>
                    <p className="text-sm text-muted-foreground">{userProfile?.experience || "0 years"} experience</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile?.topSkills?.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Matches */}
            <div className="lg:col-span-3 space-y-6">
              {careerMatches.map((match, index) => (
                <Card key={match.id || match.career_id || `match-${index}`} className="bg-card border-border hover:bg-accent/30 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Match Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">{match.title || "Career Match"}</h3>
                            <p className="text-muted-foreground">{match.description || "No description available"}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary mb-1">{Math.round(match.match_percentage || match.matchPercentage || 0)}%</div>
                            <div className="text-sm text-muted-foreground">Match</div>
                          </div>
                        </div>

                        {/* Skills Analysis */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-medium text-green-500 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Your Strengths
                            </h4>
                            <div className="space-y-2">
                              {match.matched_skills?.map((strength: string) => (
                                <div key={strength} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-sm">{strength}</span>
                                </div>
                              )) || <p className="text-sm text-muted-foreground">No strengths data available</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-500 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Skills to Develop
                            </h4>
                            <div className="space-y-2">
                              {match.missing_skills?.map((skill: string) => (
                                <div key={skill} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                  <span className="text-sm">{skill}</span>
                                </div>
                              )) || <p className="text-sm text-muted-foreground">No skills data available</p>}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Link href={`/chat-career/${match.career_id || match.id}`}>
                            <Button className="bg-primary hover:bg-primary/90">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat with {match.title}
                            </Button>
                          </Link>
                            <Link href={`/career-path/${match.career_id || match.id}`}>
                            <Button variant="outline">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              View Career Path
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

              {/* Voice Chat Modal removed - now in persona chat pages */}
    </div>
  )
}
