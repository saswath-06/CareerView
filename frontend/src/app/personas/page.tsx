"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  User, 
  Building2, 
  MapPin, 
  Calendar,
  ArrowRight,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface Persona {
  id: string
  name: string
  role: string
  company: string
  experience: string
  location: string
  salary: string
  background: string
  dailyTasks: string[]
  challenges: string[]
  advice: string[]
  created_at?: string
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:8000/personas')
        
        if (response.data && response.data.personas) {
          setPersonas(response.data.personas)
        } else {
          setPersonas([])
        }
      } catch (error) {
        console.error('Error fetching personas:', error)
        setError('Failed to load personas')
      } finally {
        setLoading(false)
      }
    }

    fetchPersonas()
  }, [])

  const deletePersona = async (personaId: string) => {
    if (!confirm(`Are you sure you want to delete this persona? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(personaId)
      await axios.delete(`http://localhost:8000/personas/${personaId}`)
      
      // Remove from local state
      setPersonas(prev => prev.filter(persona => persona.id !== personaId))
      
      console.log(`Persona ${personaId} deleted successfully`)
    } catch (error) {
      console.error('Error deleting persona:', error)
      alert('Failed to delete persona. Please try again.')
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
                <MessageCircle className="w-8 h-8 text-primary animate-pulse" />
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">Loading AI Personas</h2>
                <p className="text-muted-foreground max-w-md">
                  Retrieving your saved personas from Azure storage...
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
            <h2 className="text-2xl font-bold mb-2">Error Loading Personas</h2>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Future Self</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Chat with AI versions of your future self in different career paths. These personas are created based on your career matches and represent who you could become.
            </p>
          </div>

          {personas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Future Self Personas Available</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Upload your resume to create AI versions of your future self in different career paths. 
                These personas will be based on your career matches and represent who you could become.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Upload Resume
                  </Button>
                </Link>
                <Link href="/matches">
                  <Button variant="outline" size="lg">
                    View Career Matches
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas.map((persona, index) => (
                <Card key={persona.id || persona.persona_id || `persona-${index}`} className="bg-card border-border hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {persona.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{persona.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{persona.role}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePersona(persona.id)}
                        disabled={deleting === persona.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Company & Experience */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{persona.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{persona.location}</span>
                      </div>
                    </div>

                    {/* Experience & Salary */}
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">{persona.experience}</Badge>
                      <Badge variant="secondary">{persona.salary}</Badge>
                    </div>

                    {/* Background */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {persona.background}
                    </p>

                    {/* Daily Tasks Preview */}
                    {persona.dailyTasks && persona.dailyTasks.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Daily Tasks</h4>
                        <div className="space-y-1">
                          {persona.dailyTasks.slice(0, 2).map((task, index) => (
                            <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              <span>{task}</span>
                            </div>
                          ))}
                          {persona.dailyTasks.length > 2 && (
                            <div className="text-xs text-muted-foreground ml-3">
                              +{persona.dailyTasks.length - 2} more tasks
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    {persona.created_at && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Created {new Date(persona.created_at).toLocaleDateString()}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>AI Persona</span>
                      </div>
                      
                      <Link href={`/chat-career/${persona.id || persona.persona_id || persona.career_id || 'unknown'}`}>
                        <Button size="sm">
                          Start Chat
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
