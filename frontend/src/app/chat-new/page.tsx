"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, User, Bot, Building2, MapPin, Calendar, DollarSign, Lightbulb } from "lucide-react"
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
}

interface Message {
  id: number
  sender: "user" | "bot"
  content: string
  timestamp: string
}

export default function ChatPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:8000/personas')
        
        if (response.data && response.data.personas) {
          setPersonas(response.data.personas)
          // Auto-select first persona if available
          if (response.data.personas.length > 0) {
            setSelectedPersona(response.data.personas[0])
            // Add initial message from the persona
            setMessages([{
              id: 1,
              sender: "bot",
              content: `Hi! I'm ${response.data.personas[0].name}, a ${response.data.personas[0].role} at ${response.data.personas[0].company}. I'd love to chat with you about the ${response.data.personas[0].role.toLowerCase()} career path. What would you like to know?`,
              timestamp: new Date().toLocaleTimeString()
            }])
          }
        }
      } catch (error) {
        console.error('Error fetching personas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPersonas()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedPersona || sending) return

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setSending(true)

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        persona_id: selectedPersona.id,
        message: inputMessage,
        career_info: {} // You can pass career info here if needed
      })

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedQuestions = [
    "What does a typical day look like?",
    "How did you get into this role?",
    "What skills are most important?",
    "What are the biggest challenges?",
    "What advice do you have for newcomers?",
  ]

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
                  Retrieving available personas from Azure storage...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (personas.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No AI Personas Available</h2>
            <p className="text-muted-foreground mb-6">
              No AI personas are currently available. Personas will be created based on your career matches.
            </p>
            <Link href="/matches">
              <Button size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Career Matches
              </Button>
            </Link>
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Persona Selection Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/personas">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Personas
                  </Button>
                </Link>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Available Personas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {personas.map((persona) => (
                    <Button
                      key={persona.id}
                      variant={selectedPersona?.id === persona.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedPersona(persona)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {persona.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-medium">{persona.name}</div>
                          <div className="text-xs text-muted-foreground">{persona.role}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Suggested Questions */}
              {selectedPersona && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Suggested Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => setInputMessage(question)}
                      >
                        <Lightbulb className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="text-xs">{question}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              {selectedPersona ? (
                <Card className="bg-card border-border h-[600px] flex flex-col">
                  {/* Persona Header */}
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedPersona.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedPersona.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selectedPersona.role} at {selectedPersona.company}</p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.sender === "bot" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {selectedPersona.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-secondary">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {sending && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {selectedPersona.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Input */}
                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={sending}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!inputMessage.trim() || sending}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card border-border h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Persona</h3>
                    <p className="text-muted-foreground">Choose a persona from the sidebar to start chatting</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

