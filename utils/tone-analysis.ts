interface ToneIndicators {
  [key: string]: {
    words: string[]
    weight: number
  }
}

const toneIndicators: ToneIndicators = {
  formal: {
    words: [
      'would', 'could', 'should', 'please', 'thank', 'appreciate',
      'regards', 'sincerely', 'certainly', 'indeed', 'perhaps',
      'nevertheless', 'furthermore', 'additionally', 'however',
      'therefore', 'consequently', 'moreover', 'regarding',
      'concerning', 'respectfully', 'kindly'
    ],
    weight: 1.5
  },
  casual: {
    words: [
      'hey', 'yeah', 'cool', 'ok', 'okay', 'lol', 'haha',
      'sup', 'gonna', 'wanna', 'kinda', 'sorta', 'dunno',
      'tbh', 'tho', 'rn', 'idk', 'nvm', 'btw', 'omg',
      'like', 'literally', 'basically', 'actually'
    ],
    weight: 1.2
  },
  friendly: {
    words: [
      'thanks', 'welcome', 'happy', 'glad', 'great', 'nice',
      'love', 'care', 'sweet', 'wonderful', 'amazing',
      'awesome', 'fantastic', 'beautiful', 'lovely', 'dear',
      'friend', 'miss', 'hope', 'enjoy', 'please', 'kind'
    ],
    weight: 1.0
  },
  professional: {
    words: [
      'meeting', 'discuss', 'project', 'deadline', 'report',
      'review', 'schedule', 'confirm', 'update', 'status',
      'priority', 'urgent', 'important', 'follow-up', 'task',
      'objective', 'goal', 'timeline', 'budget', 'client'
    ],
    weight: 1.3
  }
}

export interface ToneAnalysis {
  formal: number
  casual: number
  friendly: number
  professional: number
  overall: string
  confidence: number
  indicators: {
    [key: string]: string[]
  }
}

export function analyzeTone(text: string): ToneAnalysis {
  const cleanedText = text.toLowerCase()
  const words = cleanedText.split(/\s+/)
  
  const scores: { [key: string]: number } = {
    formal: 0,
    casual: 0,
    friendly: 0,
    professional: 0
  }
  
  const foundIndicators: { [key: string]: string[] } = {
    formal: [],
    casual: [],
    friendly: [],
    professional: []
  }
  
  // Analyze each word
  words.forEach(word => {
    for (const [tone, data] of Object.entries(toneIndicators)) {
      if (data.words.includes(word)) {
        scores[tone] += data.weight
        if (!foundIndicators[tone].includes(word)) {
          foundIndicators[tone].push(word)
        }
      }
    }
  })
  
  // Calculate percentages
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0) || 1
  const percentages = Object.entries(scores).reduce((acc, [tone, score]) => {
    acc[tone] = (score / total) * 100
    return acc
  }, {} as { [key: string]: number })
  
  // Determine overall tone
  const maxTone = Object.entries(percentages).reduce((a, b) => 
    percentages[a[0]] > percentages[b[0]] ? a : b
  )
  
  // Calculate confidence
  const confidence = (maxTone[1] - 25) / 75 * 100 // 25% would be random chance
  
  return {
    ...percentages,
    overall: maxTone[0],
    confidence: Math.max(0, Math.min(100, confidence)),
    indicators: foundIndicators
  }
}

