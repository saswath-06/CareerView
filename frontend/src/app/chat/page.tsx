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

const careerPersona = {
  role: "Product Manager",
  name: "Sarah Chen",
  company: "TechFlow Inc.",
  experience: "5 years",
  location: "San Francisco, CA",
  salary: "$125K",
  background:
    "I transitioned from marketing to product management 3 years ago. I love working at the intersection of business, technology, and user experience.",
  dailyTasks: [
    "Review user feedback and analytics",
    "Collaborate with engineering teams",
    "Define product roadmaps",
    "Conduct stakeholder meetings",
  ],
  challenges: ["Balancing competing priorities", "Technical debt decisions", "Cross-team alignment"],
  advice: [
    "Start with understanding your users deeply",
    "Learn to communicate with technical teams",
    "Practice data-driven decision making",
  ],
}

const initialMessages = [
  {
    id: 1,
    sender: "bot",
    content: `Hi! I'm Sarah, a Product Manager at TechFlow Inc. I'd love to chat with you about the product management career path. What would you like to know?`,
    timestamp: "1:03:16 AM",
  },
]

const suggestedQuestions = [
  "What does a typical day look like?",
  "How did you transition into product management?",
  "What skills are most important?",
  "What are the biggest challenges?",
  "How do you work with engineering teams?",
  "What advice would you give someone starting out?",
]

export default function CareerChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(content)
      const botMessage = {
        id: messages.length + 2,
        sender: "bot" as const,
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("typical day") || lowerQuestion.includes("daily")) {
      return "My typical day starts with checking user feedback and analytics from the previous day. I spend mornings in meetings with engineering teams discussing technical feasibility of features. Afternoons are usually for stakeholder meetings, roadmap planning, and writing product requirements. I also dedicate time to user research and competitive analysis."
    }

    if (lowerQuestion.includes("transition") || lowerQuestion.includes("how did you")) {
      return "I transitioned from marketing about 3 years ago. My marketing background actually helped a lot - I understood user needs and market positioning. I started by taking online courses in product management, built some side projects, and networked with PMs at meetups. The key was showing I could think strategically about products."
    }

    if (lowerQuestion.includes("skills") || lowerQuestion.includes("important")) {
      return "The most important skills are strategic thinking, communication, and data analysis. You need to understand both business and technical aspects. Being able to translate between different teams is crucial. I'd also say empathy for users and the ability to make decisions with incomplete information are essential."
    }

    if (lowerQuestion.includes("challenge") || lowerQuestion.includes("difficult")) {
      return "The biggest challenge is balancing competing priorities with limited resources. Everyone thinks their feature is the most important! You also have to make tough decisions about technical debt vs new features. Cross-team alignment can be really challenging when everyone has different goals."
    }

    if (lowerQuestion.includes("engineering") || lowerQuestion.includes("technical")) {
      return "Working with engineering teams requires building trust and speaking their language. I learned basic technical concepts so I can have meaningful conversations about feasibility and trade-offs. I always involve them in planning and respect their expertise. Regular 1:1s with tech leads help maintain good relationships."
    }

    if (lowerQuestion.includes("advice") || lowerQuestion.includes("starting")) {
      return "My advice: start by deeply understanding users and their problems. Take courses in product management fundamentals and learn basic SQL for data analysis. Build something - even a small side project shows you can execute. Network with other PMs and don't be afraid to ask questions. The PM community is very supportive!"
    }

    return "That's a great question! Product management is such a diverse field. Every company and product is different, so experiences can vary a lot. What specific aspect of product management are you most curious about? I'm happy to share more about my experience at TechFlow or the transition process."
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/matches">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Persona Chat</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Get insights from experienced professionals in your target role. Ask about daily work, career paths, and
              industry advice.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Persona Profile */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{careerPersona.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{careerPersona.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{careerPersona.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{careerPersona.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{careerPersona.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{careerPersona.salary}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Background</h4>
                    <p className="text-sm text-muted-foreground">{careerPersona.background}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Daily Tasks</h4>
                    <ul className="space-y-1">
                      {careerPersona.dailyTasks.map((task, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="bg-card border-border h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">Chat with {careerPersona.name}</CardTitle>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "bot" && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-accent text-accent-foreground rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggested Questions */}
                  {messages.length === 1 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Suggested questions:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestedQuestion(question)}
                            className="text-xs"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about career advice, daily work, skills..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage(inputValue)
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim() || isTyping}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}