import { Card } from "@/components/ui/card"
import { Sparkles, Rocket } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'

export default function NotesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Notes</h1>
          
          <div className="grid gap-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <Sparkles className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Recent Updates</h2>
                  <ul className="list-disc list-inside space-y-3 text-gray-600">
                    <li>Implemented screenshot analysis for chat conversations</li>
                    <li>Added sentiment analysis to determine overall chat mood</li>
                    <li>Introduced "Conversation Highlights" to showcase notable moments and patterns</li>
                    <li>Enhanced UI with smooth animations and transitions</li>
                    <li>Improved navigation with active state indicators</li>
                    <li>Added confetti animation upon completion of chat analysis</li>
                    <li>Implemented animated progress bars for interest level metrics</li>
                    <li>Optimized performance with dynamic imports for heavy components</li>
                    <li>Improved responsiveness and mobile user experience</li>
                    <li>Removed HTML parsing functionality to focus on screenshot analysis</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <Rocket className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Future Plans</h2>
                  <ul className="list-disc list-inside space-y-3 text-gray-600">
                    <li>Implement user accounts for saving and comparing multiple analyses</li>
                    <li>Improve OCR accuracy for better screenshot analysis</li>
                    <li>Add support for analyzing screenshots from various messaging platforms</li>
                    <li>Develop advanced sentiment analysis for deeper insights</li>
                    <li>Create shareable reports for users to showcase their chat statistics</li>
                    <li>Introduce customizable themes and visualization options</li>
                    <li>Implement a feature to track conversation topics over time</li>
                    <li>Add more interactive elements and micro-animations for engagement</li>
                    <li>Develop a feature to compare chat analyses between different conversations</li>
                    <li>Explore AI-powered suggestions for improving communication based on analysis results</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

