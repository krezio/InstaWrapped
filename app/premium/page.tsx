'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { SubscriptionModal } from '@/components/subscription-modal'

const premiumFeatures = [
  "Detailed Sentiment Analysis",
  "Word Analysis",
  "Conversation Milestones",
  "Response Time Insights",
  "Advanced Statistics",
  "Engagement Scoring"
]

export default function PremiumPage() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-slate-800">Premium Features</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Coming Soon</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We're working hard to bring you amazing premium features. Sign up to be notified when they're ready!
          </p>
          <Button 
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
          >
            Get Notified
          </Button>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-100 rounded-full">
                  <Sparkles className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{feature}</h3>
              </div>
              <p className="text-slate-600">
                Experience advanced insights and analytics with our upcoming premium features.
              </p>
            </Card>
          ))}
        </div>
      </main>

      <SubscriptionModal 
        open={isSubscriptionModalOpen}
        onOpenChange={setIsSubscriptionModalOpen}
      />
    </div>
  )
}

