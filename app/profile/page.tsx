'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, User, CreditCard, Settings, LogOut, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertMessage } from '@/components/ui/alert-message'
import { SubscriptionModal } from '@/components/subscription-modal'

export default function ProfilePage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: { name: name }
    })
    setLoading(false)
    if (error) {
      setAlertMessage('Failed to update profile')
      setShowAlert(true)
    } else {
      setAlertMessage('Profile updated successfully')
      setShowAlert(true)
    }
  }

  const handleUpgradeToPremium = () => {
    setIsSubscriptionModalOpen(true)
  }

  const handleAddPaymentMethod = () => {
    // Implement Stripe or your preferred payment processor integration
    setIsPaymentModalOpen(true)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0">
            <motion.h1 
              className="text-3xl font-bold text-slate-800 mb-6"
              layout
            >
              Your Profile
            </motion.h1>
            
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <TabsContent value="account">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="subscription">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="p-6 bg-gradient-to-r from-rose-50 to-pink-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Current Plan</h3>
                          <p className="text-slate-600">All features currently available</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Payment Method</h3>
                        <p className="text-slate-600 mb-4">Add a payment method to manage your subscription</p>
                        <Button 
                          variant="outline" 
                          onClick={handleAddPaymentMethod}
                          className="w-full sm:w-auto"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <p className="text-sm text-slate-500">Receive email updates about your account</p>
                      </div>
                      <Switch id="notifications" />
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            <motion.div 
              className="mt-8 pt-6 border-t border-slate-200"
              layout
            >
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </motion.div>
          </Card>
        </motion.div>
        
        <AnimatePresence>
          {showAlert && (
            <AlertMessage 
              message={alertMessage} 
              type={alertMessage.includes('successfully') ? 'success' : 'error'}
              onClose={() => setShowAlert(false)}
            />
          )}
        </AnimatePresence>

        <SubscriptionModal 
          open={isSubscriptionModalOpen}
          onOpenChange={setIsSubscriptionModalOpen}
        />
      </div>
    </ProtectedRoute>
  )
}

