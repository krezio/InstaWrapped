'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Upload, Info, Heart, Clock, MessageCircle, Sparkles, Target, LucideLink, Image, Video, BarChart2, Loader2, HelpCircle, LockIcon } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { Button } from "@/components/ui/button"
import type { ChatAnalysis, InstagramChatExport } from '@/types/chat-analysis'
import { parseMessages, analyzeChat } from '@/utils/analysis'
import { Header } from '@/components/Header'
import { EmojiDisplay } from '@/components/EmojiDisplay'
import { WordItem } from '@/components/WordItem'
import { motion } from 'framer-motion'
import { ChatMood } from '@/components/ChatMood'
import { ConversationHighlights } from '@/components/ConversationHighlights'
import { ScreenshotAnalysis } from '@/components/ScreenshotAnalysis'
import { useSubscription } from '@/contexts/subscription-context'
import { SubscriptionModal } from '@/components/subscription-modal'
import { useState, useEffect } from 'react'
import { ShareableReport } from '@/components/ShareableReport'
import { AIChatTips } from '@/components/AIChatTips'


export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })
  const { isPremium } = useSubscription()

  useEffect(() => {
    const updateDimension = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
    }
    updateDimension()
    window.addEventListener('resize', updateDimension)
    return () => {
      window.removeEventListener('resize', updateDimension)
    }
  }, [])

  async function handleFileUpload(file: File) {
    if (!file) {
      setError('No file selected')
      return
    }
    
    setUploading(true)
    setError(null)

    try {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      const text = await file.text()
      console.log('File content (first 100 chars):', text.slice(0, 100))
      
      const chatData: InstagramChatExport = parseMessages(text)
      console.log('Parsed data:', chatData)

      const analysisResult = analyzeChat(chatData)
      setAnalysis(analysisResult)
    } catch (error) {
      console.error('Upload error:', error)
      setError(
        error instanceof Error 
          ? `Error: ${error.message}`
          : 'An unexpected error occurred. Please try again.'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const MetricTooltip = ({ label, description, children }: { label: string; description: string; children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="group cursor-help">
            <div className="flex items-center gap-2">
              {children}
              <Info className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <span className="font-semibold">{label}:</span> {description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const renderFreeFeatures = () => (
    <>
      {/* Messages Count */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Messages count</h3>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-3xl font-bold text-rose-500">{analysis.messageCount.You}</div>
            <div className="text-sm text-slate-500">You</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-rose-500">{analysis.messageCount.Them}</div>
            <div className="text-sm text-slate-500">Them</div>
          </div>
        </div>
      </Card>

      {/* Interest Analysis */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Interest Analysis</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <MetricTooltip 
              label="Your Interest" 
              description="Based on message frequency and reactions"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Your Interest</span>
                <span className="text-rose-500 font-semibold ml-2">{analysis.interestLevel.You.toFixed(1)}%</span>
              </div>
            </MetricTooltip>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-rose-100">
                <motion.div 
                  style={{ width: `${analysis.interestLevel.You}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.interestLevel.You}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
          <div>
            <MetricTooltip 
              label="Their Interest" 
              description="Their engagement based on messages and reactions"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Their Interest</span>
                <span className="text-rose-500 font-semibold ml-2">{analysis.interestLevel.Them.toFixed(1)}%</span>
              </div>
            </MetricTooltip>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-rose-100">
                <motion.div 
                  style={{ width: `${analysis.interestLevel.Them}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.interestLevel.Them}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Response Time */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Response Time Analysis</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-rose-500">{analysis.responseTime.You}</div>
            <div className="text-sm text-slate-500">Your average response time</div>
          </div>
          <div className="text-right space-y-2">
            <div className="text-3xl font-bold text-rose-500">{analysis.responseTime.Them}</div>
            <div className="text-sm text-slate-500">Their average response time</div>
          </div>
        </div>
      </Card>

      {/* Messages per Month */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Conversation Timeline</h3>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.monthlyActivity}>
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={12}
              />
              <RechartsTooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="messages" 
                stroke="#ec4899" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#ec4899' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Reaction Count */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Reaction Count</h3>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-3xl font-bold text-rose-500">{analysis.reactionCount.You}</div>
            <div className="text-sm text-slate-500">You</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-rose-500">{analysis.reactionCount.Them}</div>
            <div className="text-sm text-slate-500">Them</div>
          </div>
        </div>
      </Card>

      {/* Shared Links */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <LucideLink className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Shared Links</h3>
        </div>
        <div className="text-3xl font-bold text-rose-500">{analysis.sharedLinks}</div>
        <div className="text-sm text-slate-500">Total links shared in the conversation</div>
      </Card>

      {/* Media Shared */}
      <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6 card-hover-effect">
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-medium text-slate-600">Media Shared</h3>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-3xl font-bold text-rose-500">{analysis.mediaShared.images}</div>
            <div className="text-sm text-slate-500">Images</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-rose-500">{analysis.mediaShared.videos}</div>
            <div className="text-sm text-slate-500">Videos</div>
          </div>
        </div>
      </Card>
    </>
  )

  const renderPremiumFeatures = () => (
    <div className="space-y-4">
        {/* Word Count */}
        <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-medium text-slate-600">Word Count</h3>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="text-3xl font-bold text-rose-500">{analysis.wordCount.You}</div>
              <div className="text-sm text-slate-500">You</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-rose-500">{analysis.wordCount.Them}</div>
              <div className="text-sm text-slate-500">Them</div>
            </div>
          </div>
        </Card>

        {/* Top Words */}
        <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-medium text-slate-600">Top Words</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {analysis.topWords.map((word, index) => (
              <WordItem
                key={index}
                word={word.word}
                count={word.count}
                youCount={word.youCount}
                themCount={word.themCount}
              />
            ))}
          </div>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-medium text-slate-600">Sentiment Over Time</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.sentimentOverTime}>
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Conversation Milestones */}
        <Card className="col-span-1 sm:col-span-2 bg-white/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-medium text-slate-600">Conversation Milestones</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-rose-500">📅</span>
              <span>First message: {new Date(analysis.firstMessageDate).toLocaleDateString()}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">🏆</span>
              <span>Day with most messages: {analysis.dayWithMostMessages.date} ({analysis.dayWithMostMessages.count} messages)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">📏</span>
              <span>Longest message: {analysis.longestMessage.length} characters on {new Date(analysis.longestMessage.date).toLocaleDateString()}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">🎉</span>
              <span>1000th message: {analysis.thousandthMessageDate ? new Date(analysis.thousandthMessageDate).toLocaleDateString() : 'Not reached yet'}</span>
            </li>
          </ul>
        </Card>
      </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            <span className="text-slate-800">Insta</span>
            <span className="text-pink-500">Wrapped</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto animate-fade-in-up">
            Transform your Instagram conversations into beautiful insights. Upload your chat
            export and discover the story behind your messages.
          </p>
        </div>

        {!analysis ? (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8 transition-all duration-500 hover:shadow-2xl card-hover-effect">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Start Your Analysis</h2>
              <p className="text-slate-600 mt-2">
                Upload your Instagram JSON chat export file to begin exploring your conversation patterns. 
                We currently only support JSON format exports.
              </p>
            </div>

            <div
              className={`
                border-2 border-dashed rounded-xl p-12
                flex flex-col items-center justify-center
                transition-colors cursor-pointer
                ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-pink-500'}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload className={`w-12 h-12 mb-4 ${isDragging ? 'text-pink-500' : 'text-slate-400'}`} />
              <p className="text-slate-600 text-center mb-2">
                Drag & drop your Instagram chat export
              </p>
              <p className="text-slate-400 text-sm">
                or click to select a file
              </p>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
            </div>

            {uploading && (
              <div className="mt-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-rose-500 mx-auto" />
                </motion.div>
                <p className="text-slate-600 mt-4">Analyzing your chat data...</p>
                <motion.div
                  className="w-64 h-2 bg-rose-100 rounded-full mx-auto mt-4 overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: 256 }}
                  transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                >
                  <motion.div
                    className="h-full bg-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: 256 }}
                    transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  />
                </motion.div>
              </div>
            )}

            {error && (
              <div className="mt-4 text-center text-red-500">
                {error}
              </div>
            )}
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 animate-slide-up-fade card-hover-effect">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-rose-500 mb-8 text-center">InstaWrapped</h1>
              <p className="text-xs text-slate-400 text-center mb-4">
                Note: Due to limitations in Instagram's export format, some metrics may not be 100% accurate. We're continuously working to improve our analysis.
              </p>
              <ChatMood mood={analysis.overallMood} />
              <div className="mt-6">
                <ConversationHighlights highlights={analysis.highlights} />
              </div>
              <div className="mt-6">
                <AIChatTips analysis={analysis} />
              </div>

              {/* Free Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children mt-6">
                {renderFreeFeatures()}
              </div>

              {/* Premium Features */}
              <div className="mt-6">
                {renderPremiumFeatures()}
              </div>

              {analysis && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Shareable Report</h2>
                  <ShareableReport analysis={analysis} />
                </div>
              )}

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setAnalysis(null)}
                  variant="outline"
                >
                  Analyze Another Chat
                </Button>
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                >
                  Premium Coming Soon
                </Button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  InstaWrapped © 2024 • Made with <Heart className="w-4 h-4 inline-block text-rose-500" fill="currentColor" />
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Screenshot Analysis Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Screenshot Analysis</h2>
          {analysis ? (
            <ScreenshotAnalysis />
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="text-center">
                <LockIcon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Unlock Screenshot Analysis</h3>
                <p className="text-slate-600">
                  Use the Chat Export Analysis feature first to unlock Screenshot Analysis capabilities.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Need Help Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Need Help?</h2>
          <p className="text-slate-600 mb-6">
            Not sure how to get your chat data? We've got you covered.
          </p>
          <Link 
            href="/help" 
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            View Guide
          </Link>
        </div>
        <SubscriptionModal 
          open={isSubscriptionModalOpen} 
          onOpenChange={setIsSubscriptionModalOpen}
        />
      </main>
    </div>
  )
}

