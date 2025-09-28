"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  Clock, 
  User, 
  Calendar, 
  ArrowRight, 
  Target,
  BookOpen,
  Award,
  CheckCircle2,
  Circle,
  Trash2,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface StoredCareerPath {
  career_id: string
  title: string
  created_at: string
  user_profile: {
    name: string
    current_skills: string[]
    experience_level: string
  }
  learning_path: {
    steps: Array<{
      phase: string
      items: Array<{
        title: string
        description: string
        completed: boolean
        type: string
      }>
    }>
    market_insights: {
      growth_rate: string
      avg_salary: string
      top_companies: string[]
      key_skills: string[]
    }
  }
}

export default function StoredPathsPage() {
  const [careerPaths, setCareerPaths] = useState<StoredCareerPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDeleteAll, setShowDeleteAll] = useState(false)

  useEffect(() => {
    const fetchStoredPaths = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:8000/stored-career-paths')
        
        if (response.data && response.data.career_paths) {
          setCareerPaths(response.data.career_paths)
        } else {
          setCareerPaths([])
        }
      } catch (error) {
        console.error('Error fetching stored career paths:', error)
        setError('Failed to load stored career paths')
      } finally {
        setLoading(false)
      }
    }

    fetchStoredPaths()
  }, [])

  const deleteCareerPath = async (careerId: string) => {
    if (!confirm(`Are you sure you want to delete this career path? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(careerId)
      await axios.delete(`http://localhost:8000/stored-career-paths/${careerId}`)
      
      // Remove from local state
      setCareerPaths(prev => prev.filter(path => path.career_id !== careerId))
      
      console.log(`Career path ${careerId} deleted successfully`)
    } catch (error) {
      console.error('Error deleting career path:', error)
      alert('Failed to delete career path. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const deleteAllCareerPaths = async () => {
    if (!confirm(`Are you sure you want to delete ALL career paths? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting('all')
      await axios.delete('http://localhost:8000/stored-career-paths')
      
      // Clear local state
      setCareerPaths([])
      setShowDeleteAll(false)
      
      console.log('All career paths deleted successfully')
    } catch (error) {
      console.error('Error deleting all career paths:', error)
      alert('Failed to delete career paths. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">Loading Stored Career Paths</h2>
                <p className="text-muted-foreground max-w-md">
                  Retrieving your saved career paths from Azure storage...
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <div className="bg-muted rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">Loading from Azure Blob Storage</p>
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
            <h2 className="text-2xl font-bold mb-2">Error Loading Career Paths</h2>
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
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">Your Stored Career Paths</h1>
              {careerPaths.length > 0 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteAll(!showDeleteAll)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Career paths saved in Azure Blob Storage. Click on any path to view details and continue your learning journey.
            </p>
            
            {showDeleteAll && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="font-medium text-destructive">Delete All Career Paths</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This will permanently delete all {careerPaths.length} career paths from Azure storage. This action cannot be undone.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteAllCareerPaths}
                    disabled={deleting === 'all'}
                  >
                    {deleting === 'all' ? 'Deleting...' : 'Confirm Delete All'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteAll(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {careerPaths.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Career Paths Found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any career paths yet. Upload a resume and create your first career path!
              </p>
              <Link href="/matches">
                <Button size="lg">
                  <Target className="w-5 h-5 mr-2" />
                  Create Career Path
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {careerPaths.map((path, index) => {
                const completedItems = path.learning_path?.steps?.flatMap(step => step.items).filter(item => item.completed).length || 0
                const totalItems = path.learning_path?.steps?.flatMap(step => step.items).length || 1
                const progressPercentage = (completedItems / totalItems) * 100

                return (
                  <Card key={path.career_id} className="bg-card border-border hover:bg-accent/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{path.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Created for {path.user_profile?.name || "User"} • {path.created_at}
                          </p>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Career Path
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Progress Section */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-muted-foreground">
                                {completedItems}/{totalItems} completed
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>

                          {path.learning_path?.market_insights && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Market Insights</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Growth:</span>
                                  <span className="ml-1">{path.learning_path.market_insights.growth_rate}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Salary:</span>
                                  <span className="ml-1">{path.learning_path.market_insights.avg_salary}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Learning Path Preview */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">Learning Path Preview</h4>
                          {path.learning_path?.steps?.slice(0, 2).map((step, stepIndex) => (
                            <div key={stepIndex} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Circle className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{step.phase}</span>
                              </div>
                              <div className="ml-6 space-y-1">
                                {step.items.slice(0, 2).map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {item.completed ? (
                                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <Circle className="w-3 h-3" />
                                    )}
                                    <span>{item.title}</span>
                                  </div>
                                ))}
                                {step.items.length > 2 && (
                                  <div className="text-xs text-muted-foreground ml-5">
                                    +{step.items.length - 2} more items
                                  </div>
                                )}
                              </div>
                            </div>
                          )) || (
                            <p className="text-sm text-muted-foreground">No learning path data available</p>
                          )}
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{path.user_profile?.name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{path.created_at}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCareerPath(path.career_id)}
                            disabled={deleting === path.career_id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {deleting === path.career_id ? 'Deleting...' : 'Delete'}
                          </Button>
                          
                          <Link href={`/career-path/${path.career_id}`}>
                            <Button>
                              View Full Path
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
