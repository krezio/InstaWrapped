'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, FileText, HelpCircle, Shield, Menu, Sparkles, User, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useUser } from '@/contexts/UserContext'

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { href: '/help', label: 'Help', icon: HelpCircle },
    { href: '/privacy', label: 'Privacy', icon: Shield },
    { href: '/notes', label: 'Notes', icon: FileText },
    { href: '/premium', label: 'Premium', icon: Sparkles },
    user
      ? { href: '/profile', label: 'Profile', icon: User }
      : { href: '/login', label: 'Login', icon: LogIn },
  ]

  if (!user) {
    navItems.push({ href: '/signup', label: 'Sign Up', icon: User })
  }

  return (
    <AnimatePresence>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        layout
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 relative z-10">
              <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
              <span className="text-xl font-bold text-gray-900">InstaWrapped</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`text-sm font-medium transition-colors relative z-10 ${
                    pathname === item.href
                      ? 'text-rose-500'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMenu} className="relative z-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col space-y-4 mt-4">
                    {navItems.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href} 
                        className={`text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'text-rose-500'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </motion.div>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  )
}

