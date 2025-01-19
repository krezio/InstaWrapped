'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface RelationshipInsightsProps {
  analysis: {
    metrics: {
      messageCount: number
      questionFrequency: number
      responseRate: number
      emotionalTone: {
        positive: number
        negative: number
        neutral: number
      }
    }
    relationshipDynamics: {
      engagement: number
      reciprocation: number
      enthusiasm: number
    }
  }
}

export function RelationshipInsights({ analysis }: RelationshipInsightsProps) {
  const getAdvice = () => {
    const { metrics, relationshipDynamics } = analysis
    const scores = {
      interest: (relationshipDynamics.engagement + relationshipDynamics.enthusiasm) / 2,
      compatibility: (metrics.responseRate + relationshipDynamics.reciprocation) / 2,
      sentiment: metrics.emotionalTone.positive - metrics.emotionalTone.negative
    }

    const advice = []
    let overallRecommendation: 'positive' | 'neutral' | 'negative' = 'neutral'

    // Analyze interest level
    if (scores.interest > 75) {
      advice.push({
        type: 'positive',
        text: 'High mutual interest detected! There\'s definitely a spark here.'
      })
      overallRecommendation = 'positive'
    } else if (scores.interest < 40) {
      advice.push({
        type: 'negative',
        text: 'Interest levels seem low. Consider whether you\'re both equally invested.'
      })
      overallRecommendation = 'negative'
    }

    // Analyze compatibility
    if (scores.compatibility > 70) {
      advice.push({
        type: 'positive',
        text: 'Great communication flow! You both seem to be on the same wavelength.'
      })
      if (overallRecommendation !== 'negative') overallRecommendation = 'positive'
    } else if (scores.compatibility < 50) {
      advice.push({
        type: 'negative',
        text: 'Communication patterns suggest some misalignment. Try to establish better rapport.'
      })
      if (overallRecommendation !== 'positive') overallRecommendation = 'negative'
    }

    // Analyze sentiment
    if (scores.sentiment > 30) {
      advice.push({
        type: 'positive',
        text: 'The conversation has a very positive tone. Keep nurturing this connection!'
      })
    } else if (scores.sentiment < 0) {
      advice.push({
        type: 'negative',
        text: 'There seems to be some tension or negativity. Consider addressing any underlying issues.'
      })
    }

    // Add specific actionable advice
    if (metrics.questionFrequency < 0.2) {
      advice.push({
        type: 'neutral',
        text: 'Try asking more questions to show interest and keep the conversation engaging.'
      })
    }

    if (metrics.responseRate < 60) {
      advice.push({
        type: 'neutral',
        text: 'Response times could be improved. Consider being more responsive to build better connection.'
      })
    }

    return {
      advice,
      recommendation: overallRecommendation
    }
  }

  const { advice, recommendation } = getAdvice()

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-semibold text-slate-800">Relationship Insights</h3>
        <Badge variant="secondary" className="ml-auto">
          AI Analysis
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {recommendation === 'positive' && (
            <ThumbsUp className="w-8 h-8 text-green-500" />
          )}
          {recommendation === 'negative' && (
            <ThumbsDown className="w-8 h-8 text-rose-500" />
          )}
          {recommendation === 'neutral' && (
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          )}
          <div>
            <h4 className="font-medium text-slate-800">
              {recommendation === 'positive' && 'Worth Pursuing'}
              {recommendation === 'negative' && 'Proceed with Caution'}
              {recommendation === 'neutral' && 'Need More Information'}
            </h4>
            <p className="text-sm text-slate-600">
              Based on conversation analysis
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {advice.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${
                item.type === 'positive' ? 'bg-green-50 text-green-700' :
                item.type === 'negative' ? 'bg-rose-50 text-rose-700' :
                'bg-yellow-50 text-yellow-700'
              }`}
            >
              {item.text}
            </motion.div>
          ))}
        </div>

        <div className="text-xs text-slate-500 mt-4">
          Note: This is an AI-generated analysis and should be taken as a suggestion, not definitive advice.
          Always use your own judgment in relationship matters.
        </div>
      </div>
    </Card>
  )
}

