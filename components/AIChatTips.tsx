'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageCircle, Heart, Clock, Target, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatAnalysis } from '@/types/chat-analysis'

interface AIChatTipsProps {
  analysis: ChatAnalysis
}

export function AIChatTips({ analysis }: AIChatTipsProps) {
  const [tips, setTips] = useState<{ type: string; icon: JSX.Element; title: string; description: string }[]>([])
  const [loading, setLoading] = useState(false)

  const generateTips = useCallback(() => {
    setLoading(true)
    const newTips = []
    
    // Response time tips
    const avgResponseTime = {
      you: parseInt(analysis.responseTime.You),
      them: parseInt(analysis.responseTime.Them)
    }
    
    if (avgResponseTime.you > avgResponseTime.them * 2) {
      newTips.push({
        type: 'improvement',
        icon: <Clock className="w-5 h-5" />,
        title: 'Response Time',
        description: 'Try to respond more quickly to keep the conversation flowing'
      })
    } else if (avgResponseTime.you < avgResponseTime.them / 2) {
      newTips.push({
        type: 'caution',
        icon: <Clock className="w-5 h-5" />,
        title: 'Response Time',
        description: 'You might be responding too quickly. Give them time to process and respond.'
      })
    }

    // Message balance tips
    const messageRatio = analysis.messageCount.You / analysis.messageCount.Them
    if (messageRatio > 1.5) {
      newTips.push({
        type: 'balance',
        icon: <MessageCircle className="w-5 h-5" />,
        title: 'Message Balance',
        description: 'Consider giving them more space to engage in the conversation'
      })
    } else if (messageRatio < 0.6) {
      newTips.push({
        type: 'engagement',
        icon: <Heart className="w-5 h-5" />,
        title: 'Engagement',
        description: 'Try to contribute more to the conversation to show interest'
      })
    }

    // Interest level tips
    if (analysis.interestLevel.You > analysis.interestLevel.Them + 30) {
      newTips.push({
        type: 'caution',
        icon: <Target className="w-5 h-5" />,
        title: 'Interest Mismatch',
        description: 'There seems to be an imbalance in engagement levels. Consider matching their energy.'
      })
    } else if (analysis.interestLevel.Them > analysis.interestLevel.You + 30) {
      newTips.push({
        type: 'engagement',
        icon: <Target className="w-5 h-5" />,
        title: 'Interest Opportunity',
        description: 'They seem very interested. This might be a good time to deepen the connection.'
      })
    }

    // Emoji usage tips
    const emojiCount = analysis.topEmojis.reduce((sum, emoji) => sum + emoji.count, 0)
    const emojiRatio = emojiCount / analysis.messageCount.You
    if (emojiRatio > 0.5) {
      newTips.push({
        type: 'balance',
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Emoji Usage',
        description: 'You use a lot of emojis. While expressive, consider balancing with more text.'
      })
    } else if (emojiRatio < 0.1) {
      newTips.push({
        type: 'engagement',
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Emoji Usage',
        description: 'Consider using more emojis to add emotional context to your messages.'
      })
    }

    // Add general tips if we don't have enough specific ones
    const generalTips = [
      {
        type: 'general',
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Conversation Flow',
        description: 'Ask open-ended questions to keep the conversation engaging'
      },
      {
        type: 'general',
        icon: <Heart className="w-5 h-5" />,
        title: 'Show Interest',
        description: 'Reference previous conversations to show you\'re paying attention'
      },
      {
        type: 'general',
        icon: <MessageCircle className="w-5 h-5" />,
        title: 'Be Authentic',
        description: 'Share your genuine thoughts and feelings to deepen the connection'
      }
    ]

    while (newTips.length < 3) {
      const randomTip = generalTips[Math.floor(Math.random() * generalTips.length)]
      if (!newTips.some(tip => tip.title === randomTip.title)) {
        newTips.push(randomTip)
      }
    }

    setTips(newTips)
    setLoading(false)
  }, [analysis]) // Add analysis to the dependency array

  useEffect(() => {
    generateTips()
  }, [generateTips])

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-semibold text-slate-800">AI Tips</h3>
        </div>
        <Badge variant="secondary">Beta</Badge>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {tips.length > 0 ? (
            tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  tip.type === 'improvement' ? 'bg-blue-50 text-blue-700' :
                  tip.type === 'balance' ? 'bg-yellow-50 text-yellow-700' :
                  tip.type === 'engagement' ? 'bg-green-50 text-green-700' :
                  tip.type === 'caution' ? 'bg-rose-50 text-rose-700' :
                  'bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${
                    tip.type === 'improvement' ? 'text-blue-500' :
                    tip.type === 'balance' ? 'text-yellow-500' :
                    tip.type === 'engagement' ? 'text-green-500' :
                    tip.type === 'caution' ? 'text-rose-500' :
                    'text-slate-500'
                  }`}>
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{tip.title}</h4>
                    <p className="text-sm">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-slate-500"
            >
              Click the button below to generate AI tips based on your chat analysis.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={generateTips}
          disabled={loading}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Tips...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Get More Tips
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Note: These tips are generated by AI based on conversation patterns and should be taken as suggestions, not definitive advice.
      </p>
    </Card>
  )
}

