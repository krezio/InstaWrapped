export interface ChatAnalysis {
  messagesCount: {
    you: number
    them: number
  }
  responseTime: {
    you: number
    them: number
  }
  interestLevel: {
    you: number
    them: number
  }
  topEmojis: Array<{
    emoji: string
    count: number
  }>
  monthlyActivity: Array<{
    month: string
    messages: number
  }>
}

