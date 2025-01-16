'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChatAnalysis } from '@/types/chat-analysis'

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/analysis/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch analysis')
        }
        const data = await response.json()
        setAnalysis(data)
      } catch (error) {
        setError('Failed to load analysis')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <Progress value={33} className="w-[200px] mb-4" />
          <p className="text-slate-600">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-rose-50/30 p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          {error || 'Analysis not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-50/30 p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-rose-500 mb-8">Chat Wrapped</h1>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Messages Count */}
              <Card className="col-span-2 bg-white/50 rounded-2xl p-4">
                <h3 className="text-sm text-slate-600 mb-2">Messages count</h3>
                <div className="flex justify-between">
                  <div>
                    <div className="text-2xl font-bold">{analysis.messageCount.user}</div>
                    <div className="text-sm text-slate-500">you</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{analysis.messageCount.other}</div>
                    <div className="text-sm text-slate-500">them</div>
                  </div>
                </div>
              </Card>

              {/* Red Flags */}
              {analysis.redFlags.length > 0 && (
                <Card className="col-span-2 bg-white/50 rounded-2xl p-4">
                  <h3 className="text-sm text-slate-600 mb-2 flex items-center">
                    Red Flags <span className="text-rose-500 ml-1">▶</span>
                  </h3>
                  <div className="space-y-2">
                    {analysis.redFlags.map((flag, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                          {index + 1}
                        </span>
                        <span className="text-slate-700">{flag.description}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Interest Level */}
              <Card className="col-span-2 bg-white/50 rounded-2xl p-4">
                <h3 className="text-sm text-slate-600 mb-2">Interest level</h3>
                <div className="flex justify-between items-center">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#fce7f3"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3"
                        strokeDasharray={`${analysis.interestLevel.user}, 100`}
                      />
                      <text x="18" y="20.35" className="text-3xl" textAnchor="middle" fill="#ec4899">
                        {analysis.interestLevel.user}%
                      </text>
                    </svg>
                  </div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#fce7f3"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3"
                        strokeDasharray={`${analysis.interestLevel.other}, 100`}
                      />
                      <text x="18" y="20.35" className="text-3xl" textAnchor="middle" fill="#ec4899">
                        {analysis.interestLevel.other}%
                      </text>
                    </svg>
                  </div>
                </div>
              </Card>

              {/* Messages per Month */}
              <Card className="col-span-2 bg-white/50 rounded-2xl p-4">
                <h3 className="text-sm text-slate-600 mb-2">Messages per month</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysis.messagesPerMonth}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Top Emojis */}
              <Card className="col-span-2 bg-white/50 rounded-2xl p-4">
                <h3 className="text-sm text-slate-600 mb-2">Top used emojis</h3>
                <div className="space-y-2">
                  {analysis.topEmojis.map((emoji, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xl">{emoji.emoji}</span>
                      <div className="flex-1 bg-rose-100 rounded-full h-2">
                        <div 
                          className="bg-rose-500 h-2 rounded-full" 
                          style={{ width: `${(emoji.count / analysis.topEmojis[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{emoji.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Compliment Count */}
              <Card className="col-span-2 bg-white/50 rounded-2xl p-4">
                <h3 className="text-sm text-slate-600 mb-2">Compliment count</h3>
                <div className="flex justify-between">
                  <div>
                    <div className="text-2xl font-bold text-rose-500">{analysis.complimentCount.user}</div>
                    <div className="text-sm text-slate-500">you</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-rose-500">{analysis.complimentCount.other}</div>
                    <div className="text-sm text-slate-500">them</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              ChatRecap AI © 2024
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

