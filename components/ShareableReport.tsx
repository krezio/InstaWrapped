'use client'

import { useState, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, MessageCircle, Heart, Clock, Target, Sparkles, Settings2 } from 'lucide-react'
import { ChatAnalysis } from '@/types/chat-analysis'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import { motion, AnimatePresence } from 'framer-motion'
import { CustomizeReport, ReportOptions } from './CustomizeReport'

interface ShareableReportProps {
  analysis: ChatAnalysis
}

export function ShareableReport({ analysis }: ShareableReportProps) {
  const [downloading, setDownloading] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    showMessageCount: true,
    showResponseTime: true,
    showInterestLevel: true,
    showTimeline: true,
    showWordCount: true
  })

  const handleCustomizeClick = useCallback(() => {
    setCustomizing(true)
  }, [])

  const handleCustomizeClose = useCallback(() => {
    setCustomizing(false)
  }, [])

  const downloadImage = useCallback(async () => {
    const element = document.getElementById('shareable-report')
    if (!element) return
    
    setDownloading(true)
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      })
      
      const link = document.createElement('a')
      link.download = 'instawrapped-report.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    }
    setDownloading(false)
  }, [])

  const handleOptionsChange = useCallback((newOptions: ReportOptions) => {
    setReportOptions(newOptions)
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto"
        >
          <Button
            onClick={handleCustomizeClick}
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-200 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Customize Report
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto"
        >
          <Button
            onClick={downloadImage}
            disabled={downloading}
            className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download Report'}
          </Button>
        </motion.div>
      </div>

      <motion.div className="w-full">
        <Card id="shareable-report" className="w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-8 text-white">
            <h2 className="text-3xl font-bold text-center">Your InstaWrapped Report</h2>
            <p className="text-rose-100 text-center mt-2">A snapshot of your conversation</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {reportOptions.showMessageCount && (
                <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <MessageCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Message Count</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-1">
                        {analysis.messageCount.You}
                      </div>
                      <div className="text-sm text-slate-500">You</div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-1">
                        {analysis.messageCount.Them}
                      </div>
                      <div className="text-sm text-slate-500">Them</div>
                    </div>
                  </div>
                </Card>
              )}

              {reportOptions.showInterestLevel && (
                <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <Heart className="w-5 h-5 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Interest Level</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-1 break-words">
                        {analysis.interestLevel.You.toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-500">You</div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-1 break-words">
                        {analysis.interestLevel.Them.toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-500">Them</div>
                    </div>
                  </div>
                </Card>
              )}

              {reportOptions.showResponseTime && (
                <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <Clock className="w-5 h-5 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Response Time</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-1 break-words">
                        {analysis.responseTime.You}
                      </div>
                      <div className="text-sm text-slate-500">Your average</div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-1 break-words">
                        {analysis.responseTime.Them}
                      </div>
                      <div className="text-sm text-slate-500">Their average</div>
                    </div>
                  </div>
                </Card>
              )}

              {reportOptions.showWordCount && (
                <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <Sparkles className="w-5 h-5 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Word Count</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500">{analysis.wordCount.You}</div>
                      <div className="text-sm text-slate-500 mt-1">Your words</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-rose-500">{analysis.wordCount.Them}</div>
                      <div className="text-sm text-slate-500 mt-1">Their words</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {reportOptions.showTimeline && (
              <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl border-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-100 rounded-xl">
                    <Target className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="font-semibold text-slate-700">Conversation Timeline</h3>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysis.monthlyActivity}>
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8"
                        fontSize={12}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
                        }}
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
                        labelFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#ec4899' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </div>

          <div className="p-8 text-center text-slate-400 text-sm border-t">
            Generated by InstaWrapped
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {customizing && (
          <CustomizeReport
            options={reportOptions}
            onChange={handleOptionsChange}
            onClose={handleCustomizeClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

