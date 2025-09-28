"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface VoiceChatPageProps {
  params: {
    persona_id: string
  }
}

interface CallStatus {
  callId?: string
  status: 'idle' | 'connecting' | 'connected' | 'ended' | 'error'
  assistantId?: string
  error?: string
}

export default function VoiceChatPage({ params }: VoiceChatPageProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>({ status: 'idle' })
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [publicApiKey, setPublicApiKey] = useState<string | null>(null)
  const [personaName, setPersonaName] = useState('Career Expert')

  useEffect(() => {
    // Get public API key
    const fetchPublicKey = async () => {
      try {
        const response = await axios.get('http://localhost:8000/voice-chat/public-key')
        setPublicApiKey(response.data.public_api_key)
      } catch (error) {
        console.error('Error fetching public key:', error)
      }
    }

    fetchPublicKey()
  }, [])

  const startVoiceCall = async () => {
    setIsLoading(true)
    setCallStatus({ status: 'connecting' })

    try {
      // Create voice assistant
      const assistantResponse = await axios.post(`http://localhost:8000/voice-chat/create-assistant/${params.persona_id}`)
      const assistantId = assistantResponse.data.assistant_id

      // Create web call
      const callResponse = await axios.post(`http://localhost:8000/voice-chat/web-call/${assistantId}`)
      const callId = callResponse.data.call_id

      setCallStatus({
        callId,
        status: 'connected',
        assistantId
      })

      // Initialize VAPI web SDK
      if (publicApiKey && typeof window !== 'undefined') {
        // Dynamic import for VAPI SDK
        const VapiModule = await import('@vapi-ai/web')
        const Vapi = VapiModule.default || VapiModule.Vapi || VapiModule
        
        const vapi = new Vapi(publicApiKey)
        
        // Set up event listeners
        vapi.on('call-start', () => {
          console.log('Call started')
          setCallStatus(prev => ({ ...prev, status: 'connected' }))
        })

        vapi.on('call-end', () => {
          console.log('Call ended')
          setCallStatus(prev => ({ ...prev, status: 'ended' }))
        })

        vapi.on('error', (error: any) => {
          console.error('VAPI error:', error)
          setCallStatus(prev => ({ 
            ...prev, 
            status: 'error', 
            error: error.message || 'Voice call error' 
          }))
        })

        // Start the call
        await vapi.start(callId)
      }

    } catch (error: any) {
      console.error('Error starting voice call:', error)
      setCallStatus({
        status: 'error',
        error: error.response?.data?.detail || 'Failed to start voice call'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const endVoiceCall = async () => {
    if (callStatus.callId) {
      try {
        await axios.post(`http://localhost:8000/voice-chat/end-call/${callStatus.callId}`)
      } catch (error) {
        console.error('Error ending call on backend:', error)
      }
    }

    setCallStatus({ status: 'idle' })
  }

  const getStatusIcon = () => {
    switch (callStatus.status) {
      case 'idle':
        return <Phone className="w-6 h-6" />
      case 'connecting':
        return <Loader2 className="w-6 h-6 animate-spin" />
      case 'connected':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'ended':
        return <XCircle className="w-6 h-6 text-gray-500" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      default:
        return <Phone className="w-6 h-6" />
    }
  }

  const getStatusText = () => {
    switch (callStatus.status) {
      case 'idle':
        return 'Ready to Start'
      case 'connecting':
        return 'Connecting...'
      case 'connected':
        return 'Connected'
      case 'ended':
        return 'Call Ended'
      case 'error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = () => {
    switch (callStatus.status) {
      case 'idle':
        return 'bg-primary'
      case 'connecting':
        return 'bg-yellow-500'
      case 'connected':
        return 'bg-green-500'
      case 'ended':
        return 'bg-gray-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/matches">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Button>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Voice Chat</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a voice conversation with your future self as a {personaName}. 
              Speak naturally and get voice responses about your career path.
            </p>
          </div>

          {/* Voice Chat Interface */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {getStatusIcon()}
                  Voice Chat with {personaName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Display */}
                <div className="text-center">
                  <Badge 
                    variant={callStatus.status === 'connected' ? 'default' : 'secondary'}
                    className={`mb-4 ${getStatusColor()} text-white`}
                  >
                    {getStatusText()}
                  </Badge>
                  {callStatus.error && (
                    <p className="text-sm text-red-500 mt-2">{callStatus.error}</p>
                  )}
                </div>

                <Separator />

                {/* Instructions */}
                {callStatus.status === 'idle' && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ready to Start Voice Chat</h3>
                      <p className="text-muted-foreground">
                        Click "Start Voice Chat" to begin a natural conversation with your future self. 
                        You'll get voice responses and can speak naturally about your career questions.
                      </p>
                    </div>
                  </div>
                )}

                {callStatus.status === 'connected' && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Connected!</h3>
                      <p className="text-muted-foreground">
                        You're now connected! Speak naturally and get voice responses from your future self.
                        Ask about daily work, career paths, challenges, or any questions you have.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {callStatus.status === 'idle' && (
                    <Button
                      onClick={startVoiceCall}
                      disabled={isLoading || !publicApiKey}
                      className={`flex-1 ${getStatusColor()} hover:opacity-90`}
                      size="lg"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Phone className="w-5 h-5 mr-2" />
                      )}
                      Start Voice Chat
                    </Button>
                  )}

                  {callStatus.status === 'connected' && (
                    <Button
                      onClick={endVoiceCall}
                      variant="destructive"
                      className="flex-1"
                      size="lg"
                    >
                      <PhoneOff className="w-5 h-5 mr-2" />
                      End Call
                    </Button>
                  )}

                  {callStatus.status === 'ended' && (
                    <Button
                      onClick={() => setCallStatus({ status: 'idle' })}
                      className="flex-1"
                      size="lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Start New Call
                    </Button>
                  )}

                  {callStatus.status === 'error' && (
                    <Button
                      onClick={() => setCallStatus({ status: 'idle' })}
                      variant="outline"
                      className="flex-1"
                      size="lg"
                    >
                      Try Again
                    </Button>
                  )}
                </div>

                {/* Tips */}
                {callStatus.status === 'idle' && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">💡 Tips for Voice Chat</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Speak naturally and ask questions about the career</li>
                      <li>• Ask about daily work, challenges, and opportunities</li>
                      <li>• Get advice on skills to develop and next steps</li>
                      <li>• Learn about the real experience of working in this field</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
