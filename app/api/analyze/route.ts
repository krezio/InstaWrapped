import { NextResponse } from 'next/server'
import { ChatAnalysis, InstagramChatExport } from '@/types/chat-analysis'
import { kv } from '@vercel/kv'
import { nanoid } from 'nanoid'
import { analyzeChat } from '@/utils/analysis'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('chatFile') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const text = await file.text()
    let chatData: InstagramChatExport
    
    try {
      chatData = JSON.parse(text)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    // Process the chat data
    const analysis: ChatAnalysis = analyzeChat(chatData)

    // Generate a unique ID for this analysis
    const analysisId = nanoid()

    // Store the analysis in KV store
    await kv.set(`analysis:${analysisId}`, analysis)

    return NextResponse.json({ analysisId })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze chat data' },
      { status: 500 }
    )
  }
}

