"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Copy, Check, Download, ArrowLeft } from "lucide-react"
import { summarizeBlog } from "@/app/actions"

interface BlogDisplayProps {
  content: string
  onRegenerate: () => void
  onReset: () => void
}

export default function BlogDisplay({ content, onRegenerate, onReset }: BlogDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadAsTxt = () => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "blog-post.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSummarize = async () => {
    if (summary) return

    setIsSummarizing(true)
    setError(null)

    try {
      // Call the summarizeBlog function without passing an API key
      const result = await summarizeBlog(content)
      setSummary(result)
    } catch (error) {
      console.error("Error summarizing blog:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Blog Post</CardTitle>
        <Button variant="outline" size="sm" onClick={onReset}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Form
        </Button>
      </CardHeader>

      {error && (
        <div className="px-6 mb-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="full">Full Blog</TabsTrigger>
            <TabsTrigger value="summary" onClick={handleSummarize} disabled={isSummarizing}>
              {isSummarizing ? "Summarizing..." : "Summary"}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="full">
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              {content.split("\n").map((paragraph, index) => {
                // Check if paragraph is a heading
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
                      {paragraph.substring(2)}
                    </h1>
                  )
                } else if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl font-bold mt-5 mb-3">
                      {paragraph.substring(3)}
                    </h2>
                  )
                } else if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg font-bold mt-4 mb-2">
                      {paragraph.substring(4)}
                    </h3>
                  )
                } else if (paragraph.trim() === "") {
                  return <br key={index} />
                } else {
                  return (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="summary">
          <CardContent className="pt-6">
            {summary ? (
              <div className="prose dark:prose-invert max-w-none">
                {summary.split("\n").map((paragraph, index) =>
                  paragraph.trim() === "" ? (
                    <br key={index} />
                  ) : (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ),
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {isSummarizing ? "Generating summary..." : "Click to generate a summary of your blog post"}
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" onClick={downloadAsTxt}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <Button onClick={onRegenerate}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  )
}
