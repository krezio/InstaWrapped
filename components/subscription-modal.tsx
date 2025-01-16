'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log('Submitted email for updates:', email)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex flex-col items-center text-center px-4 pt-8 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
              <Sparkles className="h-6 w-6 text-rose-500" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Premium Coming Soon!</h2>
            <p className="text-slate-600 mb-6">
              We're working hard to bring you amazing premium features. Sign up to be notified when they're ready!
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                Notify Me
              </Button>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

