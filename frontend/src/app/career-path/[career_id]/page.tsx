"use client"

import { useState, useEffect, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Calendar,
  Users,
  Building2,
  Save,
} from "lucide-react"
import Link from "next/link"

const careerPath = {
  targetRole: "Product Manager",
  currentMatch: 87,
  timeToReady: "6-12 months",
  totalInvestment: "$600",
  salaryIncrease: "$35K - $50K",
  steps: [
    {
      id: 1,
      phase: "Foundation",
      duration: "0-3 months",
      status: "in-progress",
      items: [
        {
          type: "course",
          title: "Product Management Fundamentals",
          provider: "Coursera",
          duration: "6 weeks",
          cost: "$49",
          completed: true,
        },
        {
          type: "course",
          title: "Introduction to SQL",
          provider: "Codecademy",
          duration: "4 weeks",
          cost: "$39",
          completed: false,
        },
        {
          type: "project",
          title: "Build a Product Requirements Document",
          provider: "Self-directed",
          duration: "2 weeks",
          cost: "Free",
          completed: false,
        },
      ],
    },
    {
      id: 2,
      phase: "Skill Development",
      duration: "3-6 months",
      status: "upcoming",
      items: [
        {
          type: "course",
          title: "Agile Project Management",
          provider: "Udemy",
          duration: "8 weeks",
          cost: "$89",
          completed: false,
        },
        {
          type: "course",
          title: "User Research & Testing",
          provider: "Interaction Design Foundation",
          duration: "6 weeks",
          cost: "$144",
          completed: false,
        },
        {
          type: "project",
          title: "Launch a Side Project",
          provider: "Self-directed",
          duration: "12 weeks",
          cost: "Free",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      phase: "Advanced Skills",
      duration: "6-9 months",
      status: "upcoming",
      items: [
        {
          type: "course",
          title: "Data Analysis for Product Managers",
          provider: "Product School",
          duration: "4 weeks",
          cost: "$199",
          completed: false,
        },
        {
          type: "certification",
          title: "Certified Scrum Product Owner",
          provider: "Scrum Alliance",
          duration: "2 days",
          cost: "$1,295",
          completed: false,
        },
        {
          type: "networking",
          title: "Join Product Management Community",
          provider: "Product Manager HQ",
          duration: "Ongoing",
          cost: "$29/month",
          completed: false,
        },
      ],
    },
    {
      id: 4,
      phase: "Job Transition",
      duration: "9-12 months",
      status: "upcoming",
      items: [
        {
          type: "project",
          title: "Portfolio Development",
          provider: "Self-directed",
          duration: "4 weeks",
          cost: "Free",
          completed: false,
        },
        {
          type: "networking",
          title: "Informational Interviews",
          provider: "LinkedIn",
          duration: "8 weeks",
          cost: "Free",
          completed: false,
        },
        {
          type: "application",
          title: "Job Applications & Interviews",
          provider: "Various",
          duration: "4-8 weeks",
          cost: "Free",
          completed: false,
        },
      ],
    },
  ],
}

const marketInsights = {
  demandGrowth: "+15%",
  averageSalary: "$105K",
  topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
  requiredSkills: ["Product Strategy", "Data Analysis", "User Research", "Agile", "SQL"],
  jobOpenings: "12,500+",
}

function getStatusIcon(status: string, completed?: boolean) {
  if (completed) return <CheckCircle2 className="w-5 h-5 text-green-500" />
  if (status === "in-progress") return <Circle className="w-5 h-5 text-primary fill-primary/20" />
  return <Circle className="w-5 h-5 text-muted-foreground" />
}

function getTypeIcon(type: string) {
  switch (type) {
    case "course":
      return <BookOpen className="w-4 h-4" />
    case "certification":
      return <Award className="w-4 h-4" />
    case "project":
      return <Target className="w-4 h-4" />
    case "networking":
      return <Users className="w-4 h-4" />
    case "application":
      return <Building2 className="w-4 h-4" />
    default:
      return <Circle className="w-4 h-4" />
  }
}

export default function CareerPathPage({ params }: { params: { career_id: string } }) {
  const [careerPath, setCareerPath] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentCareerId, setCurrentCareerId] = useState<string | null>(null)

  // Debug logging for route parameters
  console.log("=== CAREER PATH PAGE DEBUG ===")
  console.log("CareerPathPage rendered with params:", params)
  console.log("Career ID from params:", params.career_id)
  if (typeof window !== 'undefined') {
    console.log("Current URL:", window.location.href)
    console.log("Current pathname:", window.location.pathname)
    console.log("Path segments:", window.location.pathname.split('/'))
  }
  console.log("=== END DEBUG ===")

  // Function to clear all career path caches
  const clearCareerPathCache = useCallback(() => {
    if (typeof window === 'undefined') {
      console.log("Cannot clear cache on server side")
      return
    }
    
    console.log("Manually clearing all career path caches")
    localStorage.removeItem('last_viewed_career_id')
    localStorage.removeItem('career_path_timestamp')
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('career_path_')) {
        localStorage.removeItem(key)
      }
    })
  }, [])

  // Function to manually save current career path
  const saveCareerPathManually = useCallback(() => {
    if (typeof window === 'undefined') {
      alert("Cannot save on server side. Please try again.")
      return
    }
    
    if (careerPath && currentCareerId) {
      try {
        localStorage.setItem(`career_path_${currentCareerId}`, JSON.stringify(careerPath))
        localStorage.setItem('last_viewed_career_id', currentCareerId)
        localStorage.setItem('career_path_timestamp', new Date().toISOString())
        console.log("✅ MANUALLY SAVED career path for:", currentCareerId)
        alert("Career path saved successfully!")
      } catch (error) {
        console.error("❌ Error manually saving:", error)
        alert("Error saving career path. Check console for details.")
      }
    } else {
      alert("No career path data to save.")
    }
  }, [careerPath, currentCareerId])

  // Note: Global functions removed to prevent SSR issues
  // You can still use the save button in the UI to manually save career paths

  // Generate career-specific fallback content
  const generateCareerSpecificPath = (careerId: string) => {
    const careerPaths: { [key: string]: any } = {
      'software_developer': {
        targetRole: 'Software Developer',
        timeToReady: '6-12 months',
        totalInvestment: '$2,000 - $5,000',
        salaryIncrease: '+30-50%',
        steps: [
          {
            id: 1,
            phase: "Foundation",
            duration: "2-3 months",
            status: "upcoming",
            items: [
              { 
                id: 1, 
                title: "Learn Programming Fundamentals", 
                description: "Master Python, JavaScript, or Java basics",
                completed: false,
                link: "https://www.freecodecamp.org/",
                type: "course"
              },
              { 
                id: 2, 
                title: "Complete CS50 Course", 
                description: "Harvard's Introduction to Computer Science",
                completed: false,
                link: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
                type: "course"
              },
              { 
                id: 3, 
                title: "Build First Web App", 
                description: "Create a portfolio website or simple web application",
                completed: false,
                link: "https://github.com/",
                type: "project"
              }
            ]
          },
          {
            id: 2,
            phase: "Intermediate",
            duration: "3-4 months",
            status: "upcoming",
            items: [
              { 
                id: 4, 
                title: "Learn React/Node.js", 
                description: "Master modern web development frameworks",
                completed: false,
                link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                type: "course"
              },
              { 
                id: 5, 
                title: "Build Full-Stack Projects", 
                description: "Create 2-3 substantial applications for your portfolio",
                completed: false,
                link: "https://github.com/",
                type: "project"
              },
              { 
                id: 6, 
                title: "Join Developer Communities", 
                description: "Participate in GitHub, Stack Overflow, and local meetups",
                completed: false,
                link: "https://www.linkedin.com/",
                type: "experience"
              }
            ]
          }
        ]
      },
      'data_scientist': {
        targetRole: 'Data Scientist',
        timeToReady: '8-12 months',
        totalInvestment: '$3,000 - $6,000',
        salaryIncrease: '+40-60%',
        steps: [
          {
            id: 1,
            phase: "Foundation",
            duration: "3-4 months",
            status: "upcoming",
            items: [
              { 
                id: 1, 
                title: "Learn Python & Statistics", 
                description: "Master Python programming and statistical concepts",
                completed: false,
                link: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
                type: "course"
              },
              { 
                id: 2, 
                title: "Complete Data Science Specialization", 
                description: "Johns Hopkins Data Science Specialization on Coursera",
                completed: false,
                link: "https://www.coursera.org/specializations/jhu-data-science",
                type: "course"
              },
              { 
                id: 3, 
                title: "Build Data Analysis Projects", 
                description: "Analyze datasets and create visualizations",
                completed: false,
                link: "https://www.kaggle.com/",
                type: "project"
              }
            ]
          }
        ]
      }
    }

    return careerPaths[careerId] || {
      targetRole: careerId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      timeToReady: '6-12 months',
      totalInvestment: '$2,000 - $5,000',
      salaryIncrease: '+20-40%',
      steps: [
        {
          id: 1,
          phase: "Foundation",
          duration: "2-3 months",
          status: "upcoming",
          items: [
            { 
              id: 1, 
              title: "Learn Core Concepts", 
              description: "Master fundamental principles and terminology",
              completed: false,
              link: "https://www.coursera.org/learn/fundamentals",
              type: "course"
            },
            { 
              id: 2, 
              title: "Complete Online Courses", 
              description: "Take structured learning paths (Coursera, Udemy, edX)",
              completed: false,
              link: "https://www.udemy.com/courses/",
              type: "course"
            },
            { 
              id: 3, 
              title: "Build First Project", 
              description: "Create a portfolio piece to demonstrate skills",
              completed: false,
              link: "https://github.com/explore",
              type: "project"
            }
          ]
        }
      ]
    }
  }

  // Load career path from localStorage or fetch from backend
  useEffect(() => {
    const loadCareerPath = async () => {
      try {
        setLoading(true)
        
        // Validate career_id parameter and try to extract from URL if needed
        let careerId = params.career_id
        
        if (!careerId || careerId === 'undefined' || careerId === 'null') {
          // Try to extract career_id from URL pathname as fallback
          if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/')
            const careerPathIndex = pathParts.indexOf('career-path')
            if (careerPathIndex !== -1 && pathParts[careerPathIndex + 1]) {
              careerId = pathParts[careerPathIndex + 1]
              console.log("Extracted career_id from URL:", careerId)
            }
          }
        }
        
        if (!careerId || careerId === 'undefined' || careerId === 'null') {
          const pathname = typeof window !== 'undefined' ? window.location.pathname : 'unknown'
          console.error("Invalid career_id provided:", params.career_id, "URL pathname:", pathname)
          setError("Invalid career path. Please select a career from the matches page.")
          setLoading(false)
          return
        }
        
        console.log("Loading career path for:", careerId)
        
        // Check if we have cached data for this career (only on client side)
        const cachedData = typeof window !== 'undefined' ? localStorage.getItem(`career_path_${careerId}`) : null
        const lastCareerId = typeof window !== 'undefined' ? localStorage.getItem('last_viewed_career_id') : null
        
        // If we have cached data for this career, use it
        if (cachedData && lastCareerId === careerId) {
          try {
            const parsedData = JSON.parse(cachedData)
            console.log("✅ LOADING cached career path for:", careerId)
            console.log("✅ Cached data:", parsedData)
            setCareerPath(parsedData)
            setCurrentCareerId(careerId)
            setLoading(false)
            return
          } catch (error) {
            console.error("❌ Error parsing cached data:", error)
            // Continue to fetch from API if cache is corrupted
          }
        }
        
        // If switching to a different career, clear old cache
        if (lastCareerId && lastCareerId !== careerId && typeof window !== 'undefined') {
          console.log("Switching to different career, clearing old cache")
          localStorage.removeItem(`career_path_${lastCareerId}`)
        }
        
        // Fetch new career path data
        console.log("Fetching career path from backend for:", careerId)
        const response = await axios.get(`http://localhost:8000/career-path/${careerId}`)
        
        if (response.data) {
          // Use the existing backend data structure
          const backendData = response.data
          console.log("Career ID:", careerId) // Debug log
          console.log("Backend response:", backendData) // Debug log
          
          // Map the backend learning_path to frontend format
          const learningPath = backendData.learning_path
          const marketInsights = learningPath?.market_insights
          const mappedCareerPath = {
            targetRole: backendData.current_match?.title || learningPath?.career_title || "Professional",
            timeToReady: learningPath?.personalized_assessment?.estimated_timeline || "6-12 months",
            totalInvestment: learningPath?.personalized_assessment?.estimated_cost || "$2,000 - $5,000",
            salaryIncrease: "+20-40%", // This would come from career matches
            marketInsights: marketInsights,
            steps: [
              {
                id: 1,
                phase: "Immediate Steps (0-3 months)",
                duration: "0-3 months",
                status: "upcoming",
                items: learningPath?.learning_roadmap?.immediate_steps?.map((step: any, index: number) => ({
                  id: index + 1,
                  title: step.skill,
                  description: `Priority: ${step.priority} - ${step.timeline}`,
                  completed: false,
                  courses: step.courses || [],
                  projects: step.projects || [],
                  type: "skill"
                })) || []
              },
              {
                id: 2,
                phase: "Short-term Goals (3-6 months)",
                duration: "3-6 months",
                status: "upcoming",
                items: learningPath?.learning_roadmap?.short_term_goals?.map((step: any, index: number) => ({
                  id: index + 10,
                  title: step.skill,
                  description: `Priority: ${step.priority} - ${step.timeline}`,
                  completed: false,
                  courses: step.courses || [],
                  projects: step.projects || [],
                  type: "skill"
                })) || []
              },
              {
                id: 3,
                phase: "Long-term Goals (6+ months)",
                duration: "6+ months",
                status: "upcoming",
                items: learningPath?.learning_roadmap?.long_term_goals?.map((step: any, index: number) => ({
                  id: index + 20,
                  title: step.skill,
                  description: `Priority: ${step.priority} - ${step.timeline}`,
                  completed: false,
                  courses: step.courses || [],
                  projects: step.projects || [],
                  type: "skill"
                })) || []
              }
            ]
          }
          console.log("Mapped career path:", mappedCareerPath) // Debug log
          setCareerPath(mappedCareerPath)
          setCurrentCareerId(careerId)
          
          // Save to localStorage for persistence (only on client side)
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`career_path_${careerId}`, JSON.stringify(mappedCareerPath))
              localStorage.setItem('last_viewed_career_id', careerId)
              localStorage.setItem('career_path_timestamp', new Date().toISOString())
              console.log("✅ SAVED career path to localStorage for:", careerId)
              console.log("✅ Saved data:", mappedCareerPath)
              
              // Verify the save worked
              const saved = localStorage.getItem(`career_path_${careerId}`)
              if (saved) {
                console.log("✅ VERIFIED: Data is saved in localStorage")
              } else {
                console.error("❌ ERROR: Failed to save to localStorage")
              }
            } catch (error) {
              console.error("❌ Error saving to localStorage:", error)
            }
          } else {
            console.log("⚠️ Cannot save to localStorage on server side")
          }
        } else {
          setError("Failed to fetch career path")
        }
      } catch (error) {
        console.error('Error fetching career path:', error)
        
        // Try to use cached data as fallback if API fails
        const fallbackData = localStorage.getItem(`career_path_${careerId}`)
        if (fallbackData) {
          console.log("API failed, using cached data as fallback")
          setCareerPath(JSON.parse(fallbackData))
          setCurrentCareerId(careerId)
        } else {
          setError("Failed to load career path. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadCareerPath()
  }, [params.career_id])

  // Cleanup function to clear localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're not switching to another career path (and on client side)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (!currentPath.includes('/career-path/')) {
          console.log("Clearing career path cache on unmount")
          localStorage.removeItem('last_viewed_career_id')
          // Clear all career path caches
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('career_path_')) {
              localStorage.removeItem(key)
            }
          })
        }
      }
    }
  }, [])

      if (loading) {
        return (
          <div className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <Link href="/matches">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Matches
                    </Button>
                  </Link>
                  <h1 className="text-3xl font-bold">Career Path Optimization</h1>
                </div>
                
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">Loading Career Path</h2>
                    <p className="text-muted-foreground max-w-md">
                      Creating your personalized learning roadmap with courses, projects, and timelines...
                    </p>
                  </div>
                  
                  <div className="w-full max-w-md">
                    <div className="bg-muted rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">Analyzing your skills and generating recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

  if (error || !careerPath) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Error Loading Career Path</h2>
            <p className="text-muted-foreground mb-4">{error || "Career path not found"}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/matches'}>
                Back to Career Matches
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const completedItems = careerPath.steps?.flatMap((step: any) => step.items).filter((item: any) => item.completed).length || 0
  const totalItems = careerPath.steps?.flatMap((step: any) => step.items).length || 1
  const progressPercentage = (completedItems / totalItems) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/matches">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Button>
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Path Optimization</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Your personalized roadmap to becoming a {careerPath.targetRole || "professional"} with timeline, costs, and market insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Overview */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {completedItems}/{totalItems}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{careerPath.timeToReady || "Not specified"}</div>
                        <div className="text-sm text-muted-foreground">Time to job-ready</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">{careerPath.totalInvestment || "Not specified"}</div>
                        <div className="text-sm text-muted-foreground">Total investment</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{careerPath.salaryIncrease || "Not specified"}</div>
                        <div className="text-sm text-muted-foreground">Salary increase</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Market Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-500">{careerPath.marketInsights?.growth_rate || "+15%"}</div>
                      <div className="text-sm text-muted-foreground">Growth rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{careerPath.marketInsights?.avg_salary || "$85K"}</div>
                      <div className="text-sm text-muted-foreground">Avg salary</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Top Companies</h4>
                    <div className="flex flex-wrap gap-1">
                      {careerPath.marketInsights?.top_companies?.map((company: string) => (
                        <Badge key={company} variant="secondary" className="text-xs">
                          {company}
                        </Badge>
                      )) || (
                        <div className="text-sm text-muted-foreground">No company data available</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {careerPath.marketInsights?.key_skills?.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      )) || (
                        <div className="text-sm text-muted-foreground">No skills data available</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Path Steps */}
            <div className="lg:col-span-2 space-y-6">
              {careerPath.steps?.map((step, stepIndex) => (
                <Card key={step.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(step.status)}
                        <div>
                          <CardTitle className="text-xl">
                            Phase {step.id}: {step.phase}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{step.duration}</p>
                        </div>
                      </div>
                      <Badge variant={step.status === "in-progress" ? "default" : "secondary"}>
                        {step.status === "in-progress" ? "Current" : "Upcoming"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {step.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-4 p-4 rounded-lg bg-accent/30">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(step.status, item.completed)}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              )}
                              
                              {/* Show courses if available */}
                              {item.courses && item.courses.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="text-sm font-medium text-primary mb-2">Recommended Courses:</h5>
                                  <div className="space-y-2">
                                    {item.courses.slice(0, 2).map((course: any, courseIndex: number) => (
                                      <div key={courseIndex} className="bg-accent/20 p-2 rounded text-xs">
                                        <div className="font-medium">{course.name}</div>
                                        <div className="text-muted-foreground">{course.provider}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {course.duration}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            {course.cost}
                                          </span>
                                          {course.url && (
                                            <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                              View Course
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Show projects if available */}
                              {item.projects && item.projects.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="text-sm font-medium text-green-500 mb-2">Project Ideas:</h5>
                                  <ul className="text-xs text-muted-foreground space-y-1">
                                    {item.projects.slice(0, 2).map((project: string, projectIndex: number) => (
                                      <li key={projectIndex} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span>{project}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          {!item.completed && (
                            item.link ? (
                              <Button size="sm" variant="outline" asChild>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                  Start
                                </a>
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                Start
                              </Button>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No career path steps available yet.</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Link href={`/chat-career/${params.career_id}`}>
                  <Button className="bg-primary hover:bg-primary/90">
                    Chat with {careerPath.targetRole || "AI Persona"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}