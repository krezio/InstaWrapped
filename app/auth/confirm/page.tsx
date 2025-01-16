'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({ token, type })
          if (error) throw error
        } catch (error) {
          setError('Failed to confirm email. Please try again.')
        }
      } else {
        setError('Invalid confirmation link.')
      }
      setLoading(false)
    }

    confirmEmail()
  }, [searchParams])

  const handleContinue = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto" />
              <p className="mt-4 text-slate-600">Confirming your email...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-800">Confirmation Failed</h2>
              <p className="mt-2 text-slate-600">{error}</p>
              <Button 
                onClick={() => router.push('/signup')}
                className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-800">Email Confirmed!</h2>
              <p className="mt-2 text-slate-600">Your email has been successfully confirmed. Welcome to InstaWrapped!</p>
              <Button 
                onClick={handleContinue}
                className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                Continue to Profile
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

