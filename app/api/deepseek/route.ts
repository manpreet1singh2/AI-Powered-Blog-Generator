import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { deepseek } from "@ai-sdk/deepseek"

// Helper function to create a blog prompt
function createBlogPromptHelper(topic: string, tone: string, audience: string, keywords: string[]) {
  return `
You are a professional blog writer with expertise in SEO, content marketing, and storytelling.

📝 Task:
Write a detailed, engaging, and SEO-optimized blog article on the topic: **"${topic}"**

🎯 Target Audience:
${audience}

🗣️ Tone:
${tone}

🔍 Keywords to include naturally:
${keywords.join(", ")}

✅ Format Requirements:
- Start with an attention-grabbing hook
- Use short paragraphs, bullet points, and subheadings (H2/H3)
- Make it informative and easy to read
- Include practical tips or value-driven insights
- End with a strong conclusion or call-to-action

🚫 Don'ts:
- No robotic tone
- No unnecessary repetition
- No generic filler text

💡 Goal:
The blog should feel like it's written by a human expert. Make it natural, helpful, and ready to publish.

Return only the blog content. Do not include any extra comments or explanations.
`
}

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      model = "deepseek-chat",
      temperature = 0.7,
      useTemplate = false,
      topic,
      tone,
      audience,
      keywords,
    } = await request.json()

    // Use the environment variable directly
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "DeepSeek API key is missing. Please set the DEEPSEEK_API_KEY environment variable.",
        },
        { status: 400 },
      )
    }

    let finalPrompt = prompt

    // Use the template if requested
    if (useTemplate && topic && tone && audience && keywords) {
      finalPrompt = createBlogPromptHelper(
        topic,
        tone,
        audience,
        Array.isArray(keywords) ? keywords : keywords.split(","),
      )
    }

    if (!finalPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: deepseek(model, { apiKey }), // Pass API key to the model
      prompt: finalPrompt,
      temperature,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("DeepSeek API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate text with DeepSeek API"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
