'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AlertMessageProps {
  message: string
  type?: 'success' | 'error'
  onClose?: () => void
  duration?: number
}

export function AlertMessage({ 
  message, 
  type = 'success', 
  onClose,
  duration = 5000 
}: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`
            rounded-lg shadow-lg px-6 py-4 flex items-center gap-3
            ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-rose-50 text-rose-800'}
          `}>
            {type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500" />
            )}
            <p className="text-sm font-medium">{message}</p>
            <button
              onClick={() => {
                setIsVisible(false)
                onClose?.()
              }}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

