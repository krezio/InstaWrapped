import { cleanText, tokenize, removeStopWords } from './text-processing'

interface Pattern {
  phrase: string
  count: number
  context: string[]
}

export function findPatterns(text: string): Pattern[] {
  const cleanedText = cleanText(text)
  const words = tokenize(cleanedText)
  const significantWords = removeStopWords(words)
  
  // Find repeating phrases (3-5 words)
  const patterns: Map<string, Pattern> = new Map()
  
  for (let windowSize = 3; windowSize <= 5; windowSize++) {
    for (let i = 0; i < significantWords.length - windowSize; i++) {
      const phrase = significantWords.slice(i, i + windowSize).join(' ')
      
      // Skip phrases that are too short or contain invalid characters
      if (phrase.length < 5 || !/^[a-z0-9\s]+$/.test(phrase)) continue
      
      const context = words.slice(Math.max(0, i - 3), i + windowSize + 3).join(' ')
      
      if (patterns.has(phrase)) {
        const pattern = patterns.get(phrase)!
        pattern.count++
        if (!pattern.context.includes(context)) {
          pattern.context.push(context)
        }
      } else {
        patterns.set(phrase, {
          phrase,
          count: 1,
          context: [context]
        })
      }
    }
  }
  
  // Filter and sort patterns
  return Array.from(patterns.values())
    .filter(pattern => pattern.count > 1) // Only include repeated patterns
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function analyzeMessageStructure(text: string) {
  const lines = text.split('\n').filter(line => line.trim())
  const structures = {
    questions: 0,
    statements: 0,
    exclamations: 0,
    greetings: 0,
    farewells: 0
  }
  
  const greetingPatterns = /^(hi|hey|hello|good (morning|afternoon|evening)|yo|sup)/i
  const farewellPatterns = /^(bye|goodbye|see you|talk|later|good night)/i
  
  lines.forEach(line => {
    if (line.includes('?')) structures.questions++
    else if (line.includes('!')) structures.exclamations++
    else structures.statements++
    
    if (greetingPatterns.test(line.trim())) structures.greetings++
    if (farewellPatterns.test(line.trim())) structures.farewells++
  })
  
  return structures
}

