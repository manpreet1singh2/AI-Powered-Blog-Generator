import { Suspense } from "react"
import DirectPromptGenerator from "@/components/direct-prompt-generator"
import ApiKeyCheck from "@/components/api-key-check"
import { Loader2 } from "lucide-react"

export default function DirectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl mb-4">
              Direct Prompt Blog Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Generate blog posts using your custom prompt template
            </p>
          </div>

          <ApiKeyCheck />

          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            }
          >
            <DirectPromptGenerator />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
