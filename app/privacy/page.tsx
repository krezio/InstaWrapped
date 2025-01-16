import { Card } from "@/components/ui/card"
import { Shield, Lock, Eye } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy & Security</h1>
          
          <div className="grid gap-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <Lock className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Your Data Stays Private</h2>
                  <p className="text-gray-600">
                    InstaWrapped processes all your data directly in your browser. We never store, collect, or transmit your chat data to any servers. Your conversations remain completely private and secure.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <Shield className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Client-Side Processing</h2>
                  <p className="text-gray-600">
                    All analysis happens locally in your browser using JavaScript. Your data never leaves your device, making it completely safe to use. The site works even without an internet connection once loaded.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <Eye className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Transparency</h2>
                  <p className="text-gray-600">
                    Our code is open source and available for inspection. We believe in complete transparency about how your data is handled. You can verify that we never store or transmit any of your personal information.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

