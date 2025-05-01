"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BlogDisplay from "@/components/blog-display"

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
  tone: z.string().min(2, {
    message: "Please select a tone.",
  }),
  audience: z.string().min(3, {
    message: "Audience must be at least 3 characters.",
  }),
  keywords: z.string().min(3, {
    message: "Please provide at least one keyword.",
  }),
})

export default function DirectPromptGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [blogContent, setBlogContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "conversational",
      audience: "",
      keywords: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    setBlogContent(null)
    setError(null)

    try {
      // Parse keywords into array
      const keywordsArray = values.keywords.split(",").map((k) => k.trim())

      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useTemplate: true,
          topic: values.topic,
          tone: values.tone,
          audience: values.audience,
          keywords: keywordsArray,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate blog")
      }

      const data = await response.json()
      setBlogContent(data.text)
    } catch (error) {
      console.error("Error generating blog:", error)
      setError(error instanceof Error ? error.message : "Failed to generate blog. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!blogContent ? (
        <Card>
          <CardHeader>
            <CardTitle>Direct Prompt Generator</CardTitle>
            <CardDescription>Generate a blog post using the custom prompt template</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. How to Start Affiliate Marketing in 2025" {...field} />
                      </FormControl>
                      <FormDescription>The main topic of your blog post</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The writing style of your blog</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Beginners looking to earn online" {...field} />
                      </FormControl>
                      <FormDescription>Who will be reading this blog post</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. affiliate marketing, online income, passive earning" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated keywords to include in your blog</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Blog...
                    </>
                  ) : (
                    "Generate Blog"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <BlogDisplay
          content={blogContent}
          onRegenerate={() => {
            form.handleSubmit(onSubmit)()
          }}
          onReset={() => {
            setBlogContent(null)
          }}
        />
      )}
    </div>
  )
}
