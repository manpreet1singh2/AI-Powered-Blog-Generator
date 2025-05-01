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
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { generateBlog } from "@/app/actions"
import BlogDisplay from "@/components/blog-display"

// Update the form schema to include audience
const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
  niche: z.string().min(2, {
    message: "Please select a niche.",
  }),
  audience: z.string().optional(),
  tone: z.string().min(2, {
    message: "Please select a tone.",
  }),
  keywords: z.string().optional(),
  length: z.number().min(300).max(2000),
  additionalInstructions: z.string().optional(),
})

export default function BlogGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [blogContent, setBlogContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Update the form defaultValues to include audience
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      niche: "technology",
      audience: "",
      tone: "professional",
      keywords: "",
      length: 800,
      additionalInstructions: "",
    },
  })

  // Update the onSubmit function to remove API key handling
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    setBlogContent(null)
    setError(null)

    try {
      // Call the server action without passing an API key
      const result = await generateBlog(values)
      setBlogContent(result)
    } catch (error) {
      console.error("Error generating blog:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
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
            <CardTitle>Blog Generator</CardTitle>
            <CardDescription>Fill in the details below to generate a custom blog post</CardDescription>
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
                        <Input placeholder="e.g. Benefits of Meditation for Productivity" {...field} />
                      </FormControl>
                      <FormDescription>The main topic of your blog post</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="niche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niche</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a niche" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="health">Health & Wellness</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="food">Food & Cooking</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The industry or category of your blog</FormDescription>
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
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
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
                </div>

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. meditation, productivity, focus, mindfulness" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated keywords to include in your blog</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Length: {field.value} words</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={300}
                          max={2000}
                          step={100}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>Choose the approximate word count for your blog</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Instructions (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Include a section about scientific research, add a call-to-action at the end"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Any specific requirements or sections you want in your blog</FormDescription>
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
