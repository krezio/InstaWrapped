'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ArrowLeftRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChatAnalysis } from '@/types/chat-analysis'
import { analyzeChat } from '@/utils/analysis'

export function ChatComparison() {
  const [chat1, setChat1] = useState<ChatAnalysis | null>(null)
  const [chat2, setChat2] = useState<ChatAnalysis | null>(null)

  const handleFileUpload = async (file: File, setChatFunction: (analysis: ChatAnalysis) => void) => {
    try {
      const text = await file.text()
      const chatData = JSON.parse(text)
      const analysis = analyzeChat(chatData)
      setChatFunction(analysis)
    } catch (error) {
      console.error('Error analyzing chat:', error)
    }
  }

  const renderUploadArea = (setChatFunction: (analysis: ChatAnalysis) => void) => (
    <div
      className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 transition-colors"
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <Upload className="w-8 h-8 text-rose-500 mb-4" />
      <p className="text-slate-600 text-center mb-2">Upload chat export</p>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file, setChatFunction)
        }}
      />
    </div>
  )

  const renderAnalysis = (analysis: ChatAnalysis) => (
    <div className="space-y-4">
      <p>Total Messages: {analysis.messageCount.You + analysis.messageCount.Them}</p>
      <p>Your Messages: {analysis.messageCount.You}</p>
      <p>Their Messages: {analysis.messageCount.Them}</p>
      {/* Add more analysis details as needed */}
    </div>
  )

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Chat Comparison</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Chat 1</h3>
          {chat1 ? renderAnalysis(chat1) : renderUploadArea(setChat1)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Chat 2</h3>
          {chat2 ? renderAnalysis(chat2) : renderUploadArea(setChat2)}
        </div>
      </div>
      {chat1 && chat2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">Comparison Results</h3>
          <div className="space-y-4">
            <p>Message Count Difference: {Math.abs((chat1.messageCount.You + chat1.messageCount.Them) - (chat2.messageCount.You + chat2.messageCount.Them))}</p>
            {/* Add more comparison metrics */}
          </div>
        </motion.div>
      )}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8"
      >
        <Button
          onClick={() => {
            setChat1(null)
            setChat2(null)
          }}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Compare New Chats
        </Button>
      </motion.div>
    </Card>
  )
}

