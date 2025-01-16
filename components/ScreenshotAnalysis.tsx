import { useState } from 'react'
import { Upload, ImageIcon, Loader2, Heart, Sparkles, Target, MessageCircle, AlertTriangle } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from 'framer-motion'
import Tesseract from 'tesseract.js'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MessageMetrics {
  messageCount: number
  conversationStyle: string
  matchScore: number
  topPhrases: Array<{ phrase: string; count: number }>
  emotionalTone: {
    positive: number
    neutral: number
    negative: number
  }
}

interface AnalysisResult {
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
  metrics: MessageMetrics
  confidence: number
}

interface Message {
  content: string
  sender: string
  timestamp: string
}

const extractMessages = (text: string): Message[] => {
  //Basic message extraction -  replace with your actual logic
  const lines = text.split('\n');
  const messages: Message[] = [];
  lines.forEach(line => {
    if (line.trim() !== "") {
      messages.push({ content: line.trim(), sender: "Unknown", timestamp: "Unknown" });
    }
  });
  return messages;
};


export function ScreenshotAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  const cleanText = (text: string): string => {
    return text
      .replace(/[^\w\s!?.,'"@#$%^&*()-=+[\]{}|;:<>\/\\¯\\_₋🙂😊😄😃🥰😘💕💖👍♥️😒😤😠😡👎😢😭💔]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }


  const analyzeMessages = (messages: Message[]): AnalysisResult => {
    // Sentiment patterns with weights
    const patterns = {
      positive: {
        emojis: /[😊😄😃🥰😘💕💖👍♥️]/,
        phrases: /\b(?:love|happy|great|good|nice|awesome|amazing|perfect|thank|please)\b/i,
        punctuation: /!{2,}|\?!/
      },
      negative: {
        emojis: /[😒😤😠😡👎😢😭💔]/,
        phrases: /\b(?:hate|bad|awful|terrible|sad|angry|upset|annoyed)\b/i,
        punctuation: /\.\.\.|\.$/
      }
    }

    let metrics = {
      messageCount: messages.length,
      conversationStyle: '',
      matchScore: 0,
      topPhrases: [] as Array<{ phrase: string; count: number }>,
      emotionalTone: {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    }

    // Analyze each message
    let positiveScore = 0
    let negativeScore = 0
    let phraseMap = new Map<string, number>()

    messages.forEach(message => {
      // Sentiment analysis with weighted scoring
      let messageScore = 0
      const content = message.content.toLowerCase()

      // Check patterns
      if (patterns.positive.emojis.test(content)) messageScore += 2
      if (patterns.positive.phrases.test(content)) messageScore += 1
      if (patterns.positive.punctuation.test(content)) messageScore += 0.5

      if (patterns.negative.emojis.test(content)) messageScore -= 2
      if (patterns.negative.phrases.test(content)) messageScore -= 1
      if (patterns.negative.punctuation.test(content)) messageScore -= 0.5

      if (messageScore > 0) positiveScore++
      else if (messageScore < 0) negativeScore++

      // Extract and count meaningful phrases
      const words = content.split(/\s+/)
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ')
        if (phrase.length > 8 && !phrase.match(/^[0-9\s]+$/)) {
          phraseMap.set(phrase, (phraseMap.get(phrase) || 0) + 1)
        }
      }
    })

    // Calculate emotional tone percentages
    const totalMessages = messages.length || 1
    metrics.emotionalTone = {
      positive: Math.round((positiveScore / totalMessages) * 100),
      negative: Math.round((negativeScore / totalMessages) * 100),
      neutral: Math.round(((totalMessages - positiveScore - negativeScore) / totalMessages) * 100)
    }

    // Determine conversation style
    const avgLength = messages.reduce((sum, msg) => sum + msg.content.length, 0) / totalMessages
    metrics.conversationStyle =
      avgLength < 15 ? "Quick Replies" :
      avgLength < 30 ? "Casual Chat" :
      avgLength < 50 ? "Balanced Discussion" :
      "Detailed Conversation"

    // Calculate match score
    const engagementScore = Math.min(100, (messages.length / 10) * 25)
    const sentimentScore = ((positiveScore - negativeScore) / totalMessages) * 50 + 50
    const varietyScore = (messages.filter(msg => msg.content.includes('?')).length / totalMessages) * 25
    metrics.matchScore = Math.round((engagementScore + sentimentScore + varietyScore) / 3)

    // Get top phrases
    metrics.topPhrases = Array.from(phraseMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([phrase, count]) => ({ phrase, count }))

    // Calculate confidence based on message quality
    const confidence = Math.min(100,
      (messages.length > 10 ? 40 : messages.length * 4) +
      (metrics.topPhrases.length * 10) +
      (Object.values(metrics.topPhrases).some(v => v.count > 0) ? 30 : 0)
    )

    return {
      text: `Analyzed ${messages.length} messages from the conversation`,
      sentiment: metrics.emotionalTone.positive > metrics.emotionalTone.negative ? 'positive' :
        metrics.emotionalTone.negative > metrics.emotionalTone.positive ? 'negative' : 'neutral',
      metrics,
      confidence
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setLoading(true)
    setError(null)
    setProcessingProgress(0)

    try {
      setImage(URL.createObjectURL(uploadedFile))
      const result = await Tesseract.recognize(
        uploadedFile,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProcessingProgress(Math.round(m.progress * 100))
            }
          }
        }
      )

      const text = result.data.text
      const messages = extractMessages(text)
      
      if (messages.length === 0) {
        throw new Error('No messages could be detected in the image')
      }

      const analysisResult = analyzeMessages(messages)
      setAnalysis(analysisResult)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(
        err instanceof Error 
          ? err.message
          : 'Failed to analyze image. Please ensure it contains chat messages.'
      )
    } finally {
      setLoading(false)
    }
  }

  const renderMetricCard = (title: string, value: string | number, icon: React.ReactNode, description?: string) => (
    <Card className="bg-white/50 p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-medium text-slate-600">{title}</h4>
      </div>
      <div className="text-2xl font-bold text-rose-500">
        {typeof value === 'number' ? `${value}%` : value}
      </div>
      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}
    </Card>
  )

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8 transition-all duration-500 hover:shadow-2xl card-hover-effect">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Screenshot Analysis</h2>
        <p className="text-sm text-slate-500">
          Beta Feature: This experimental feature is currently under development and may have limited accuracy.
          We support screenshot analysis of chat conversations.
        </p>
      </div>

      {!file ? (
        <div
          className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-colors"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <Upload className="w-12 h-12 mb-4 text-slate-400" />
          <p className="text-slate-600 text-center mb-2">
            Upload a screenshot for analysis
          </p>
          <p className="text-slate-400 text-sm">
            or click to select a file
          </p>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {image && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img src={image} alt="Uploaded screenshot" className="object-cover w-full h-full" />
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-8 h-8 text-rose-500" />
              </motion.div>
              <p className="text-slate-600">Processing file... {processingProgress}%</p>
              <Progress value={processingProgress} className="w-[200px]" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {analysis && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-2">Analysis Overview:</h3>
                <p className="text-slate-600">{analysis.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                    analysis.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    Overall Mood: {analysis.sentiment}
                  </div>
                  <div className="text-sm text-slate-500">
                    Confidence: {analysis.confidence}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderMetricCard("Match Score",
                  analysis.metrics.matchScore,
                  <Heart className="w-5 h-5 text-rose-500" />,
                  "Overall compatibility rating"
                )}
                {renderMetricCard("Style",
                  analysis.metrics.conversationStyle,
                  <MessageCircle className="w-5 h-5 text-rose-500" />,
                  "Communication pattern"
                )}
                {renderMetricCard("Messages",
                  analysis.metrics.messageCount,
                  <Target className="w-5 h-5 text-rose-500" />,
                  "Total messages analyzed"
                )}
              </div>

              <Card className="bg-white/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h4 className="text-sm font-medium text-slate-600">Emotional Tone</h4>
                </div>
                <div className="space-y-3">
                  {Object.entries(analysis.metrics.emotionalTone).map(([tone, percentage]) => (
                    <div key={tone}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{tone}</span>
                        <span>{Math.round(percentage)}%</span>
                      </div>
                      <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-rose-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {analysis.metrics.topPhrases.length > 0 && (
                <Card className="bg-white/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-rose-500" />
                    <h4 className="text-sm font-medium text-slate-600">Common Phrases</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {analysis.metrics.topPhrases.map((phrase, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-slate-600">"{phrase.phrase}"</span>
                        <span className="text-rose-500 font-medium">{phrase.count}x</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={() => {
                setFile(null)
                setImage(null)
                setAnalysis(null)
                setError(null)
              }}
              variant="outline"
            >
              Analyze Another File
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

