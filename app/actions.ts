"use server"

import { generateText } from "ai"
import { deepseek } from "@ai-sdk/deepseek"

// Update the BlogInput type to include audience but remove apiKey
type BlogInput = {
  topic: string
  niche: string
  tone: string
  audience?: string
  keywords?: string
  length: number
  additionalInstructions?: string
}

// Advanced prompt engineering with multi-step prompt chaining
export async function generateBlog(input: BlogInput): Promise<string> {
  // Use the environment variable directly
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error("DeepSeek API key is missing. Please set the DEEPSEEK_API_KEY environment variable.")
  }

  // Create DeepSeek client with the API key
  const deepseekWithKey = (model: string) => deepseek(model, { apiKey })

  // Step 1: Generate an outline with SEO considerations
  const outlinePrompt = createOutlinePrompt(input)
  const { text: outline } = await generateText({
    model: deepseekWithKey("deepseek-chat"),
    prompt: outlinePrompt,
    temperature: 0.7,
  })

  // Step 2: Generate the full blog post based on the outline
  const blogPrompt = createBlogPrompt(input, outline)
  const { text: blogContent } = await generateText({
    model: deepseekWithKey("deepseek-chat"),
    prompt: blogPrompt,
    temperature: 0.8,
  })

  // Step 3: Evaluate and enhance the SEO of the blog
  const enhancedBlogPrompt = createEnhancementPrompt(input, blogContent)
  const { text: enhancedBlog } = await generateText({
    model: deepseekWithKey("deepseek-chat"),
    prompt: enhancedBlogPrompt,
    temperature: 0.6,
  })

  return enhancedBlog
}

// Update the createOutlinePrompt function to include audience
function createOutlinePrompt(input: BlogInput): string {
  return `You are an expert content strategist specializing in the ${input.niche} niche.

Task: Create a detailed outline for a ${input.length}-word blog post on "${input.topic}".

Consider the following:
- The blog should have a ${input.tone} tone
- Target audience: ${input.audience || `Readers interested in the ${input.niche} niche`}
- Target keywords: ${input.keywords || "No specific keywords provided"}
- The outline should include a compelling title, introduction, 3-5 main sections with subpoints, and a conclusion
- Each section should address a specific aspect of the topic
- Include suggestions for statistics or examples to include

Additional instructions: ${input.additionalInstructions || "None provided"}

Format the outline with clear headings and bullet points. This outline will be used to write a full blog post.`
}

// Function to create a prompt for generating the full blog post
function createBlogPrompt(input: BlogInput, outline: string): string {
  // Extract keywords as an array
  const keywordsArray = input.keywords ? input.keywords.split(",").map((k) => k.trim()) : []

  return `
You are a professional blog writer with expertise in SEO, content marketing, and storytelling.

📝 Task:
Write a detailed, engaging, and SEO-optimized blog article on the topic: **"${input.topic}"**
Use this outline as a guide:
${outline}

🎯 Target Audience:
${input.audience || `Readers interested in the ${input.niche} niche`}

🗣️ Tone:
${input.tone}

🔍 Keywords to include naturally:
${keywordsArray.join(", ") || "No specific keywords provided"}

✅ Format Requirements:
- Start with an attention-grabbing hook
- Use short paragraphs, bullet points, and subheadings (H2/H3)
- Make it informative and easy to read
- Include practical tips or value-driven insights
- End with a strong conclusion or call-to-action
- The total word count should be approximately ${input.length} words

🚫 Don'ts:
- No robotic tone
- No unnecessary repetition
- No generic filler text

💡 Goal:
The blog should feel like it's written by a human expert. Make it natural, helpful, and ready to publish.

Additional instructions: ${input.additionalInstructions || "None provided"}

Return only the blog content. Do not include any extra comments or explanations.
`
}

// Function to create a prompt for enhancing the blog's SEO
function createEnhancementPrompt(input: BlogInput, blogContent: string): string {
  return `You are an SEO expert and content editor.

Task: Review and enhance the following blog post for SEO optimization and readability:

${blogContent}

Enhancements to make:
- Ensure the title is SEO-friendly and compelling
- Optimize keyword density for these terms: ${input.keywords || "No specific keywords provided"}
- Improve readability with better paragraph structure if needed
- Ensure headings follow proper hierarchy (# for main title, ## for sections, ### for subsections)
- Add internal linking suggestions in [brackets] where relevant
- Ensure the content maintains a ${input.tone} tone
- Keep the total word count close to ${input.length} words

Return the enhanced blog post in markdown format. Do not include the [brackets] suggestions in the final output, just improve the content directly.`
}

// Function to summarize a blog post
export async function summarizeBlog(content: string): Promise<string> {
  // Use the environment variable directly
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error("DeepSeek API key is missing. Please set the DEEPSEEK_API_KEY environment variable.")
  }

  const summaryPrompt = `You are a professional content summarizer.

Task: Create a concise summary of the following blog post:

${content}

Guidelines:
- The summary should be approximately 150-200 words
- Capture the main points and key takeaways
- Maintain the original tone
- Format in 2-3 paragraphs
- Include the most important information that would give a reader a good overview

Return only the summary text.`

  const { text: summary } = await generateText({
    model: deepseek("deepseek-chat", { apiKey }),
    prompt: summaryPrompt,
    temperature: 0.5,
  })

  return summary
}
