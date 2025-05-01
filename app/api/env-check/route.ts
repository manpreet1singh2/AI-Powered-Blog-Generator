import { NextResponse } from "next/server"

export async function GET() {
  // Check if the DEEPSEEK_API_KEY environment variable is set
  const hasApiKey = !!process.env.DEEPSEEK_API_KEY

  return NextResponse.json({
    hasApiKey,
    message: hasApiKey
      ? "DEEPSEEK_API_KEY environment variable is set"
      : "DEEPSEEK_API_KEY environment variable is not set",
  })
}
