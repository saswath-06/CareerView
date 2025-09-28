"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageCircle } from "lucide-react"

interface OpenAIVoiceChatProps {
  personaId: string
  personaName: string
  userBackground?: string
  userGoals?: string
  onClose?: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function OpenAIVoiceChat({ personaId, personaName, userBackground, userGoals, onClose }: OpenAIVoiceChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleUserInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
    }

    // Speech synthesis is handled in speakText function

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      speechSynthesis.cancel()
    }
  }, [])

  const handleUserInput = async (transcript: string) => {
    if (!transcript.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send to backend for OpenAI processing with user data
      const response = await fetch(`http://localhost:8000/voice-chat/openai-chat/${personaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcript,
          conversation_history: messages.slice(-5), // Last 5 messages for context
          user_background: userBackground || "",
          user_goals: userGoals || ""
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Speak the response
      speakText(data.response)
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = (text: string) => {
    if (isMuted) return

    // Cancel any current speech
    speechSynthesis.cancel()

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = volume
    utterance.rate = 1.0
    utterance.pitch = 1.0
    
    // Try to use a good voice
    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Samantha')
    )
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    
    // Set up event handlers
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsSpeaking(false)
    }
    
    speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const toggleMute = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
    }
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    // Volume will be applied to new utterances in speakText function
  }

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="default" className="bg-blue-500">Processing...</Badge>
    if (isListening) return <Badge variant="default" className="bg-green-500">Listening</Badge>
    if (isSpeaking) return <Badge variant="default" className="bg-purple-500">Speaking</Badge>
    return <Badge variant="secondary">Ready</Badge>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Voice Chat with {personaName}
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with {personaName}!</p>
              <p className="text-sm">Click the microphone to speak.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              <span className="ml-2">
                {isListening ? 'Stop' : 'Speak'}
              </span>
            </Button>

            <Button
              onClick={toggleMute}
              variant="outline"
              className={isMuted ? 'bg-red-50 border-red-200' : ''}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20"
              disabled={isMuted}
            />
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onClose} variant="ghost" className="w-full">
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
