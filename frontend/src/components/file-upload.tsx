"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"

interface FileUploadProps {
  onUpload: (file: File) => void
  isUploading?: boolean
}

export function FileUpload({ onUpload, isUploading = false }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setUploadStatus('idle')
      onUpload(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'border-border hover:border-primary/50'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button 
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                variant="outline"
                size="sm"
              >
                Remove File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Click to upload your resume
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX, or TXT (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
        
        {uploadStatus === 'error' && (
          <div className="mt-4 flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Upload failed. Please try again.</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
