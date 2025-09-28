"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, User, Bot, Building2, MapPin, Calendar, DollarSign, Lightbulb, Loader2, Mic } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { OpenAIVoiceChat } from "@/components/openai-voice-chat"

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

export default function ChatCareerPage({ params }: { params: { career_id: string } }) {
  const [persona, setPersona] = useState<Persona | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [sending, setSending] = useState(false)
  const [showVoiceChat, setShowVoiceChat] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Generate unique IDs for messages
  const generateMessageId = () => {
    return Date.now() + Math.random()
  }

  useEffect(() => {
    const createAndLoadPersona = async () => {
      try {
        setLoading(true)
        setCreating(true)
        
        // Get user profile data for voice chat
        try {
          const userResponse = await axios.get('http://localhost:8000/career-matches/user123')
          if (userResponse.data && userResponse.data.user_profile) {
            setUserProfile(userResponse.data.user_profile)
          }
        } catch (error) {
          console.log('Could not fetch user profile for voice chat:', error)
        }
        
        // Validate career_id parameter
        if (!params.career_id || params.career_id === 'undefined' || params.career_id === 'unknown') {
          console.error('Invalid career_id:', params.career_id)
          setMessages([{
            id: generateMessageId(),
            sender: "bot",
            content: "sorry, i couldn't find the career info. please go back and try again.",
            timestamp: new Date().toLocaleTimeString()
          }])
          setLoading(false)
          setCreating(false)
          return
        }
        
        // Create future self persona for this career
        const response = await axios.post(`http://localhost:8000/personas/create-future-self/${params.career_id}`)
        
        if (response.data && response.data.persona) {
          setPersona(response.data.persona)
          
          // Add initial message from the future self
          const role = response.data.persona?.role || response.data.persona?.title || params.career_id?.replace('_', ' ') || 'professional'
          const initialMessage: Message = {
            id: generateMessageId(),
            sender: "bot",
            content: `hey! i'm your future self as a ${role.toLowerCase()}. i've been where you are now and made it to this career. what do you want to know about this path?`,
            timestamp: new Date().toLocaleTimeString()
          }
          setMessages([initialMessage])
        }
      } catch (error) {
        console.error('Error creating future self persona:', error)
        setMessages([{
          id: generateMessageId(),
          sender: "bot",
          content: "sorry, i couldn't create your future self persona right now. try again later.",
          timestamp: new Date().toLocaleTimeString()
        }])
      } finally {
        setLoading(false)
        setCreating(false)
      }
    }

    createAndLoadPersona()
  }, [params.career_id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !persona || sending) return

    // Store the message content before clearing the input
    const messageContent = inputMessage.trim()
    
    const userMessage: Message = {
      id: generateMessageId(),
      sender: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString()
    }

    // Add user message to the chat immediately
    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      console.log('Adding user message:', userMessage)
      console.log('Updated messages array:', newMessages)
      return newMessages
    })
    
    // Clear input and set sending state
    setInputMessage("")
    setSending(true)

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        persona_id: persona.id,
        message: messageContent, // Use the stored message content
        career_info: {}
      })

      const botMessage: Message = {
        id: generateMessageId(),
        sender: "bot",
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: generateMessageId(),
        sender: "bot",
        content: "sorry, having trouble responding right now. try again",
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
    "what's a typical day like?",
    "how did you get here from where i am now?",
    "what should i focus on learning first?",
    "what are the biggest challenges?",
    "what advice do you have for me?"
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">
                  {creating ? "Creating Your Future Self" : "Loading Chat"}
                </h2>
                <p className="text-muted-foreground max-w-md">
                  {creating 
                    ? "Generating your future self persona based on your resume and career path..."
                    : "Setting up your chat with your future self..."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Future Self Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/personas">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Personas
                  </Button>
                </Link>
              </div>

              {persona && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Future Self</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {persona.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{persona.name}</div>
                        <div className="text-sm text-muted-foreground">{persona.role}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{persona.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{persona.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{persona.salary}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {persona.background}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Suggested Questions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Ask Your Future Self</CardTitle>
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
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border h-[600px] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {persona?.name.split(' ').map(n => n[0]).join('') || 'FS'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {persona ? `Chat with ${persona.name}` : 'Future Self Chat'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {persona ? `Your future self as a ${persona.role}` : 'Loading...'}
                      </p>
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
                            {persona?.name.split(' ').map(n => n[0]).join('') || 'FS'}
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
                          {persona?.name.split(' ').map(n => n[0]).join('') || 'FS'}
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
                      placeholder="Ask your future self..."
                      disabled={sending || !persona}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => setShowVoiceChat(true)} 
                      variant="outline"
                      disabled={!persona}
                      className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button onClick={sendMessage} disabled={!inputMessage.trim() || sending || !persona}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Chat Modal */}
      {showVoiceChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full">
            <OpenAIVoiceChat
              personaId={params.career_id}
              personaName={persona?.name || 'Career Expert'}
              userBackground={userProfile ? `Name: ${userProfile.name || 'User'}, Experience: ${userProfile.experience_years || '0'} years, Top Skills: ${(userProfile.top_skills || []).join(', ')}` : ''}
              userGoals="Career transition and growth"
              onClose={() => setShowVoiceChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
