'use client'

import { createContext, useContext } from 'react'

interface SubscriptionContextType {
  isPremium: boolean
  setIsPremium: (value: boolean) => void
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: true,
  setIsPremium: () => {}
})

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  // Always return true for isPremium
  const isPremium = true
  const setIsPremium = () => {}

  return (
    <SubscriptionContext.Provider value={{ isPremium, setIsPremium }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}

