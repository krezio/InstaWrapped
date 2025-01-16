import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = await kv.get(`analysis:${params.id}`)
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}

