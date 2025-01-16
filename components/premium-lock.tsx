'use client'

import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/contexts/subscription-context'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { SubscriptionModal } from './subscription-modal'

interface PremiumLockProps {
  children: React.ReactNode
}

export function PremiumLock({ children }: PremiumLockProps) {
  const { isPremium } = useSubscription()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isPremium) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center text-center space-y-4 max-w-sm"
        >
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Premium Features</h3>
          <p className="text-slate-600">
            Unlock detailed insights and advanced analytics with Premium
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105"
          >
            Upgrade to Premium
          </Button>
        </motion.div>
      </motion.div>
      <SubscriptionModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}

