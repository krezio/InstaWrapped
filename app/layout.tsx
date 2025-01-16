import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { SubscriptionProvider } from '@/contexts/subscription-context'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        <UserProvider>
          <SubscriptionProvider>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
              <div className="page-transition">
                {children}
              </div>
            </div>
          </SubscriptionProvider>
        </UserProvider>
      </body>
    </html>
  )
}

