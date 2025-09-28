"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface FutureSelfButtonProps {
  careerId: string
  careerTitle: string
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function FutureSelfButton({ 
  careerId, 
  careerTitle, 
  className = "",
  size = "default",
  variant = "default"
}: FutureSelfButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateFutureSelf = async () => {
    try {
      setLoading(true)
      
      // Create future self persona
      const response = await axios.post(`http://localhost:8000/personas/create-future-self/${careerId}`)
      
      if (response.data && response.data.persona) {
        // Navigate to chat with the created persona
        router.push(`/chat-career/${careerId}`)
      }
    } catch (error) {
      console.error('Error creating future self persona:', error)
      // Still navigate to chat page, it will handle the error
      router.push(`/chat-career/${careerId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCreateFutureSelf}
      disabled={loading}
      size={size}
      variant={variant}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating Future Self...
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat with {careerTitle}
        </>
      )}
    </Button>
  )
}

