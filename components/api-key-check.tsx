"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ApiKeyCheck() {
  const [envKeyAvailable, setEnvKeyAvailable] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if environment variable is set
    async function checkEnvKey() {
      try {
        const response = await fetch("/api/env-check")
        const data = await response.json()
        setEnvKeyAvailable(data.hasApiKey)
      } catch (error) {
        console.error("Error checking environment variable:", error)
        setEnvKeyAvailable(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnvKey()
  }, [])

  if (isLoading) {
    return null
  }

  if (!envKeyAvailable) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Key Required</AlertTitle>
        <AlertDescription>
          No DeepSeek API key found. Please set the DEEPSEEK_API_KEY environment variable to use the blog generator.
        </AlertDescription>
      </Alert>
    )
  }

  if (envKeyAvailable) {
    return (
      <Alert variant="default" className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/20">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>API Key Available</AlertTitle>
        <AlertDescription>Using API key from environment variables.</AlertDescription>
      </Alert>
    )
  }

  return null
}
