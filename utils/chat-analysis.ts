import { ChatMessage, ChatAnalysis } from '@/types/chat-analysis'

export function parseMessages(text: string): ChatMessage[] {
  // This is a basic implementation - adjust based on your chat export format
  const lines = text.split('\n')
  const messages: ChatMessage[] = []

  for (const line of lines) {
    try {
      const [timestamp, sender, content] = line.split('|').map(s => s.trim())
      if (timestamp && sender && content) {
        messages.push({ timestamp, sender, content })
      }
    } catch (e) {
      continue // Skip invalid lines
    }
  }

  return messages
}

export function analyzeChatData(messages: ChatMessage[]): ChatAnalysis {
  const analysis: ChatAnalysis = {
    messageCount: { user: 0, other: 0 },
    responseTime: { user: 0, other: 0 },
    redFlags: [],
    interestLevel: { user: 0, other: 0 },
    attachmentStyle: { user: 'secure', other: 'secure' },
    messagesPerMonth: [],
    topEmojis: [],
    complimentCount: { user: 0, other: 0 }
  }

  // Count messages
  messages.forEach(msg => {
    if (msg.sender === 'user') {
      analysis.messageCount.user++
    } else {
      analysis.messageCount.other++
    }
  })

  // Calculate response times
  let lastMessageTime: Date | null = null
  let totalUserResponseTime = 0
  let totalOtherResponseTime = 0
  let userResponseCount = 0
  let otherResponseCount = 0

  messages.forEach(msg => {
    const currentTime = new Date(msg.timestamp)
    if (lastMessageTime) {
      const responseTime = (currentTime.getTime() - lastMessageTime.getTime()) / 1000 // in seconds
      if (msg.sender === 'user') {
        totalUserResponseTime += responseTime
        userResponseCount++
      } else {
        totalOtherResponseTime += responseTime
        otherResponseCount++
      }
    }
    lastMessageTime = currentTime
  })

  analysis.responseTime.user = userResponseCount ? totalUserResponseTime / userResponseCount : 0
  analysis.responseTime.other = otherResponseCount ? totalOtherResponseTime / otherResponseCount : 0

  // Analyze red flags
  const lateNightMessages = messages.filter(msg => {
    const hour = new Date(msg.timestamp).getHours()
    return hour >= 0 && hour < 5
  })

  if (lateNightMessages.length > 0) {
    analysis.redFlags.push({
      type: 'late_night',
      description: 'Frequently texting after midnight'
    })
  }

  // Calculate interest level based on message frequency and length
  const userMessages = messages.filter(msg => msg.sender === 'user')
  const otherMessages = messages.filter(msg => msg.sender !== 'user')

  analysis.interestLevel.user = Math.min(
    100,
    (userMessages.length / messages.length) * 100
  )
  analysis.interestLevel.other = Math.min(
    100,
    (otherMessages.length / messages.length) * 100
  )

  // Group messages by month
  const messagesByMonth = new Map<string, number>()
  messages.forEach(msg => {
    const month = new Date(msg.timestamp).toISOString().slice(0, 7)
    messagesByMonth.set(month, (messagesByMonth.get(month) || 0) + 1)
  })

  analysis.messagesPerMonth = Array.from(messagesByMonth.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))

  // Count emojis
  const emojiRegex = /[\p{Emoji}]/gu
  const emojiCount = new Map<string, number>()
  
  messages.forEach(msg => {
    const emojis = msg.content.match(emojiRegex) || []
    emojis.forEach(emoji => {
      emojiCount.set(emoji, (emojiCount.get(emoji) || 0) + 1)
    })
  })

  analysis.topEmojis = Array.from(emojiCount.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return analysis
}

