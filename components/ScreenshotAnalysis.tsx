'use client'

import { useState, useCallback } from 'react'
import { Upload, ImageIcon, Loader2, Heart, Sparkles, Target, MessageCircle, AlertTriangle, RefreshCw, Trash2, Clock, Smile, Frown, Meh, Brain } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import Tesseract from 'tesseract.js'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { findPatterns, analyzeMessageStructure } from '@/utils/pattern-analysis'
import { analyzeTone } from '@/utils/tone-analysis'
import { cleanText } from '@/utils/text-processing'

interface AnalysisResult {
  text: string
  metrics: {
    messageCount: number
    averageLength: number
    sentiment: number
    emojis: number
    questions: number
    exclamations: number
    links: number
    timeOfDay: {
      morning: number
      afternoon: number
      evening: number
      night: number
    }
  }
  patterns: {
    common: Array<{
      phrase: string
      count: number
      context: string[]
    }>
    messageStructure: {
      questions: number
      statements: number
      exclamations: number
      greetings: number
      farewells: number
    }
  }
  tone?: {
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
  aiTips: string[]
}

export function ScreenshotAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('metrics')
  const [generatingTips, setGeneratingTips] = useState(false)

  const sanitizeText = (text: string): string => {
    // Remove non-printable characters and normalize whitespace
    return text
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const isValidPhrase = (phrase: string): boolean => {
    // Check if phrase contains actual words (at least 2 characters long)
    return phrase.split(' ').every(word => word.length >= 2) &&
           phrase.length >= 5 && // Minimum total length
           !/^\d+$/.test(phrase) && // Not just numbers
           !/^[^a-zA-Z]+$/.test(phrase) // Contains at least some letters
  }

  const analyzeText = (text: string): AnalysisResult => {
    const cleanedText = cleanText(text)
    const patterns = findPatterns(cleanedText)
    const messageStructure = analyzeMessageStructure(cleanedText)
    const sanitizedText = sanitizeText(cleanedText)
    const lines = sanitizedText.split('\n').filter(line => line.trim())
    const words = sanitizedText.split(/\s+/)
    
    const metrics = {
      messageCount: lines.length,
      averageLength: words.length / lines.length || 0,
      sentiment: calculateSentiment(sanitizedText),
      emojis: (sanitizedText.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length,
      questions: (sanitizedText.match(/\?/g) || []).length,
      exclamations: (sanitizedText.match(/!/g) || []).length,
      links: (sanitizedText.match(/https?:\/\/[^\s]+/g) || []).length,
      timeOfDay: {
        morning: (sanitizedText.match(/\b([6-9]|1[0-1])\s*(am|AM)\b/g) || []).length,
        afternoon: (sanitizedText.match(/\b(1[2-5])\s*(pm|PM)\b/g) || []).length,
        evening: (sanitizedText.match(/\b([6-9])\s*(pm|PM)\b/g) || []).length,
        night: (sanitizedText.match(/\b(1[0-1])\s*(pm|PM)|1[2-5]\s*(am|AM)\b/g) || []).length
      }
    }

    let toneAnalysis;
    try {
      toneAnalysis = analyzeTone(cleanedText);
    } catch (error) {
      console.error('Error in tone analysis:', error);
      toneAnalysis = undefined;
    }

    return {
      text: cleanedText.slice(0, 200) + (cleanedText.length > 200 ? '...' : ''),
      metrics,
      patterns: {
        common: patterns,
        messageStructure
      },
      tone: toneAnalysis,
      aiTips: generateAITips(metrics, patterns, toneAnalysis)
    }
  }

  const generateAITips = (
    metrics: AnalysisResult['metrics'], 
    patterns: AnalysisResult['patterns']['common'], 
    tone: AnalysisResult['tone'] | undefined
  ): string[] => {
    const tips: string[] = []

    // Message length tips
    if (metrics.averageLength < 5) {
      tips.push("Your messages tend to be very short. Consider being more descriptive to better convey your thoughts.")
    } else if (metrics.averageLength > 50) {
      tips.push("Your messages are quite long. Consider breaking them into smaller chunks for better readability.")
    }

    // Question frequency tips
    const questionRatio = metrics.questions / metrics.messageCount
    if (questionRatio < 0.1) {
      tips.push("Try asking more questions to keep the conversation engaging and show interest.")
    } else if (questionRatio > 0.5) {
      tips.push("You ask a lot of questions. Try balancing with more statements and sharing your own thoughts.")
    }

    // Emoji usage tips
    const emojiRatio = metrics.emojis / metrics.messageCount
    if (emojiRatio === 0) {
      tips.push("Consider using some emojis to add emotional context to your messages.")
    } else if (emojiRatio > 3) {
      tips.push("You use many emojis. While expressive, consider using them more sparingly for clarity.")
    }

    // Tone-based tips
    if (tone?.formal > 70) {
      tips.push("Your tone is very formal. Consider being more casual if this is a friendly conversation.")
    } else if (tone?.casual > 80) {
      tips.push("Your tone is very casual. Consider being slightly more formal in certain contexts.")
    }

    // Time-based tips
    const nightMessages = metrics.timeOfDay.night
    if (nightMessages > metrics.messageCount * 0.3) {
      tips.push("You send many late-night messages. Consider maintaining better chat boundaries for work-life balance.")
    }

    // Sentiment-based tips
    if (metrics.sentiment < -0.3) {
      tips.push("The conversation has a negative tone. Try to maintain a more positive or neutral approach.")
    }

    return tips.slice(0, 5) // Return top 5 most relevant tips
  }

  const calculateSentiment = (text: string): number => {
    const positiveWords = ['love', 'happy', 'great', 'awesome', 'excellent', '😊', '❤️', '😍', 'thanks', 'good', 'nice']
    const negativeWords = ['sad', 'bad', 'hate', 'awful', 'terrible', '😢', '😠', '😡', 'sorry', 'wrong', 'never']
    
    const words = text.toLowerCase().split(/\s+/)
    let score = 0
    let wordCount = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        score += 1
        wordCount++
      }
      if (negativeWords.includes(word)) {
        score -= 1
        wordCount++
      }
    })
    
    return wordCount > 0 ? score / wordCount : 0
  }


  const extractPatterns = (text: string, patterns: string[]): string[] => {
    const matches = patterns.filter(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i')
      return regex.test(text) && isValidPhrase(pattern)
    })
    return Array.from(new Set(matches)) // Remove duplicates
  }

  const findCommonPhrases = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/)
    const phrases: { [key: string]: number } = {}
    
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ')
      if (isValidPhrase(phrase)) {
        phrases[phrase] = (phrases[phrase] || 0) + 1
      }
    }
    
    return Object.entries(phrases)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([phrase]) => phrase)
  }

  const analyzeTone = (text: string): { formal: number; casual: number; friendly: number; professional: number; overall: string; confidence: number; indicators: { [key: string]: string[]; } } => {
    const formalIndicators = ['would', 'could', 'should', 'please', 'thank you', 'regards', 'sincerely', 'appreciate']
    const casualIndicators = ['hey', 'yeah', 'cool', 'ok', 'lol', 'haha', 'sup', 'gonna', 'wanna']
    const friendlyIndicators = ['❤️', '😊', '😍', 'love', 'miss', 'hug', 'friend', 'care', 'thanks']
    const professionalIndicators = ['meeting', 'deadline', 'project', 'report', 'strategy', 'client', 'customer']
    
    const words = text.toLowerCase().split(/\s+/)
    let formal = 0, casual = 0, friendly = 0, professional = 0
    
    words.forEach(word => {
      if (formalIndicators.includes(word)) formal++
      if (casualIndicators.includes(word)) casual++
      if (friendlyIndicators.includes(word)) friendly++
      if (professionalIndicators.includes(word)) professional++
    })
    
    const total = formal + casual + friendly + professional || 1
    const overall = Math.max(formal, casual, friendly, professional) > 5 ? 
      (formal > casual && formal > friendly && formal > professional ? "Formal" :
      casual > formal && casual > friendly && casual > professional ? "Casual" :
      friendly > formal && friendly > casual && friendly > professional ? "Friendly" : "Professional") : "Neutral"
    const confidence = Math.max(formal, casual, friendly, professional) / total * 100
    const indicators = {
      formal: formalIndicators.filter(word => words.includes(word)),
      casual: casualIndicators.filter(word => words.includes(word)),
      friendly: friendlyIndicators.filter(word => words.includes(word)),
      professional: professionalIndicators.filter(word => words.includes(word))
    }
    
    return {
      formal: (formal / total) * 100,
      casual: (casual / total) * 100,
      friendly: (friendly / total) * 100,
      professional: (professional / total) * 100,
      overall,
      confidence,
      indicators
    }
  }

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setProcessingProgress(0)

    try {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        throw new Error('Please upload a JPG, PNG, or WebP image file')
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB')
      }

      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      setFile(file)

      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProcessingProgress(Math.round(m.progress * 100))
          }
        }
      })

      if (!result.data.text.trim()) {
        throw new Error('No text could be extracted from this image. Please try a clearer screenshot.')
      }

      const analysisResult = analyzeText(result.data.text)
      setAnalysis(analysisResult)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze image')
      if (image) URL.revokeObjectURL(image)
      setImage(null)
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const renderMetricCard = (title: string, value: string | number, icon: React.ReactNode, description?: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-300 transform hover:scale-[1.02]">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h4 className="text-sm font-medium text-slate-600">{title}</h4>
        </div>
        <div className="text-2xl font-bold text-rose-500">
          {value}
        </div>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </Card>
    </motion.div>
  )

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Screenshot Analysis</h2>
        <p className="text-sm text-slate-500">
          Beta Feature: Upload a screenshot of your chat conversation for quick insights.
        </p>
      </div>

      {!file ? (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
            loading ? 'opacity-50 pointer-events-none' : ''
          }`}
          whileHover={{ scale: 1.02, borderColor: '#ec4899' }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-rose-500 mb-4" />
            <p className="text-slate-600 text-center mb-2">
              Drop your screenshot here
            </p>
            <p className="text-slate-400 text-sm">
              or click to browse files
            </p>
          </div>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />
        </motion.div>
      ) : (
        <div className="space-y-6">
          {image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-lg overflow-hidden bg-slate-100"
            >
              <img src={image || "/placeholder.svg"} alt="Chat Screenshot" className="object-contain w-full h-full" />
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 py-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-rose-500" />
                </motion.div>
              </div>
              <div className="text-center">
                <p className="text-slate-600 font-medium">Analyzing your screenshot...</p>
                <p className="text-sm text-slate-400">This may take a few moments</p>
              </div>
              <Progress value={processingProgress} className="w-[200px]" />
              <p className="text-sm text-slate-500">{processingProgress}% complete</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button 
                onClick={() => {
                  setError(null)
                  setFile(null)
                  setImage(null)
                }}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Tabs defaultValue="metrics" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
                  <TabsTrigger value="metrics" className="data-[state=active]:bg-rose-100">
                    Basic Metrics
                  </TabsTrigger>
                  <TabsTrigger value="patterns" className="data-[state=active]:bg-rose-100">
                    Patterns
                  </TabsTrigger>
                  <TabsTrigger value="tone" className="data-[state=active]:bg-rose-100">
                    Tone Analysis
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="data-[state=active]:bg-rose-100">
                    AI Tips
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderMetricCard(
                      "Messages",
                      analysis.metrics.messageCount,
                      <MessageCircle className="w-5 h-5 text-rose-500" />,
                      "Total messages detected"
                    )}
                    {renderMetricCard(
                      "Average Length",
                      `${Math.round(analysis.metrics.averageLength)} words`,
                      <Target className="w-5 h-5 text-rose-500" />,
                      "Average message length"
                    )}
                    {renderMetricCard(
                      "Sentiment",
                      analysis.metrics.sentiment > 0.3 ? "Positive" : 
                      analysis.metrics.sentiment < -0.3 ? "Negative" : "Neutral",
                      analysis.metrics.sentiment > 0.3 ? <Smile className="w-5 h-5 text-green-500" /> :
                      analysis.metrics.sentiment < -0.3 ? <Frown className="w-5 h-5 text-red-500" /> :
                      <Meh className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="patterns" className="mt-6">
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Common Patterns</h3>
                      <div className="space-y-4">
                        {analysis.patterns.common.map((pattern, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-sm">
                                {pattern.count}x
                              </Badge>
                              <span className="text-slate-600 font-medium">
                                {pattern.phrase}
                              </span>
                            </div>
                            <div className="text-sm text-slate-500 bg-slate-50 p-2 rounded">
                              Example: "{pattern.context[0]}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Message Structure</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(analysis.patterns.messageStructure).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <span className="capitalize text-slate-600">
                              {type.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tone" className="mt-6">
                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Overall Tone</h3>
                        <Badge variant="secondary" className="capitalize">
                          {analysis.tone?.overall || 'N/A'} ({Math.round(analysis.tone?.confidence || 0)}% confidence)
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {Object.entries(analysis.tone || {})
                          .filter(([key]) => !['overall', 'confidence', 'indicators'].includes(key))
                          .map(([type, value]) => (
                            <div key={type} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{type}</span>
                                <span>{Math.round(value as number)}%</span>
                              </div>
                              <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value as number}%` }}
                                  className="h-full bg-rose-500"
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              {analysis.tone?.indicators && analysis.tone.indicators[type] && analysis.tone.indicators[type].length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {analysis.tone.indicators[type].map((word, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {word}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="mt-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">AI Communication Tips</h3>
                      <Brain className="w-5 h-5 text-rose-500" />
                    </div>
                    <div className="space-y-4">
                      {analysis.aiTips.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 bg-rose-50 p-4 rounded-lg"
                        >
                          <Sparkles className="w-5 h-5 text-rose-500 mt-0.5" />
                          <p className="text-slate-700">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      )}
    </Card>
  )
}

