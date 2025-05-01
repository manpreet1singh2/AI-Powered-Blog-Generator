"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  apiKey: z.string().min(10, {
    message: "API key must be at least 10 characters.",
  }),
})

interface ApiKeyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (apiKey: string) => void
}

export default function ApiKeyForm({ open, onOpenChange, onSubmit }: ApiKeyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Store API key in localStorage
      localStorage.setItem("deepseek-api-key", values.apiKey)
      onSubmit(values.apiKey)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving API key:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter DeepSeek API Key</DialogTitle>
          <DialogDescription>
            You need a DeepSeek API key to generate blog posts. Your key is stored locally and never sent to our
            servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your DeepSeek API key" {...field} type="password" />
                  </FormControl>
                  <FormDescription>Get your API key from the DeepSeek dashboard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save API Key"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
