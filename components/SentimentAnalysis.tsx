'use client'

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface SentimentAnalysisProps {
  sentimentData: Array<{ timestamp: number; sentiment: number }>
}

export function SentimentAnalysis({ sentimentData }: SentimentAnalysisProps) {
  const averageSentiment = sentimentData.reduce((acc, curr) => acc + curr.sentiment, 0) / sentimentData.length

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Sentiment Over Time</h3>
            <p className="text-sm text-slate-600">Emotional tone of your conversation</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Info className="w-4 h-4" />
            {averageSentiment > 0.3 ? 'Mostly Positive' : 
             averageSentiment < -0.3 ? 'Mostly Negative' : 'Generally Neutral'}
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                dataKey="timestamp" 
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp)
                  return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                }}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(value) => value.toFixed(1)}
                domain={[-1, 1]}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                formatter={(value: number) => [value.toFixed(2), 'Sentiment Score']}
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#ec4899' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 p-4 rounded-lg"
        >
          <p className="text-sm text-slate-600">
            This chart shows how the emotional tone of your conversation changes over time. 
            Positive values (above 0) indicate positive sentiment (happiness, excitement, etc.), 
            while negative values suggest negative emotions (frustration, sadness, etc.). 
            The dotted line at 0 represents neutral sentiment.
          </p>
        </motion.div>
      </div>
    </Card>
  )
}

