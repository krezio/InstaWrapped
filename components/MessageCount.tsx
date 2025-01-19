'use client'

import { Card } from "@/components/ui/card"
import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface MessageCountProps {
  you: number
  them: number
}

export function MessageCount({ you, them }: MessageCountProps) {
  const total = you + them
  const youPercentage = (you / total) * 100
  const themPercentage = (them / total) * 100

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-semibold text-slate-800">Message Distribution</h3>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-3xl font-bold text-rose-500">{you}</div>
            <div className="text-sm text-slate-500">Your messages</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-rose-500">{them}</div>
            <div className="text-sm text-slate-500">Their messages</div>
          </div>
        </div>

        <div className="sr-only">
          You sent {you} messages ({youPercentage.toFixed(1)}%) and they sent {them} messages ({themPercentage.toFixed(1)}%)
        </div>

        <div
          className="h-4 bg-slate-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={youPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Message distribution"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${youPercentage}%` }}
            className="h-full bg-rose-500"
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between text-sm text-slate-600">
          <span>{youPercentage.toFixed(1)}%</span>
          <span>{themPercentage.toFixed(1)}%</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600">
            {youPercentage > themPercentage + 20
              ? "You're sending significantly more messages. Consider giving them more space to engage."
              : themPercentage > youPercentage + 20
              ? "They're more active in the conversation. You might want to engage more."
              : "The conversation has a balanced message distribution."}
          </p>
        </div>
      </div>
    </Card>
  )
}

