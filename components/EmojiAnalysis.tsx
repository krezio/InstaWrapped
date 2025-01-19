'use client'

import { Card } from "@/components/ui/card"
import { StickerIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmojiAnalysisProps {
  emojis: Array<{ emoji: string; count: number }>;
}

export function EmojiAnalysis({ emojis }: EmojiAnalysisProps) {
  if (!emojis?.length) {
    return (
      <Card className="bg-white/50 rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-6">
          <StickerIcon className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-600 text-center">No emojis found in this conversation</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/50 rounded-2xl p-6">
      <h3 className="text-sm font-medium text-slate-600 mb-4">Emoji Analysis</h3>
      <div className="space-y-4">
        {emojis.map((emoji, index) => (
          <motion.div
            key={`${emoji.emoji}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-xl">
              <span className="text-2xl select-none">{emoji.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Used {emoji.count} times</span>
                <span className="text-rose-500 font-medium">
                  {Math.round((emoji.count / emojis[0].count) * 100)}%
                </span>
              </div>
              <div className="bg-rose-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-rose-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(emoji.count / emojis[0].count) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

