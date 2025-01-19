import { Card } from "@/components/ui/card"
import { Sparkles, Rocket } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import { motion } from 'framer-motion'

export default function NotesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Project Notes
          </motion.h1>
          
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <Sparkles className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Recent Updates</h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-600">
                      <li>Enhanced Screenshot Analysis with detailed metrics and visualizations</li>
                      <li>Improved Sentiment Analysis with better explanations and trend visualization</li>
                      <li>Added smooth animations to toggle buttons and interactions</li>
                      <li>Enhanced Message Count visualization with percentage bars</li>
                      <li>Improved mobile responsiveness across all components</li>
                      <li>Added tabbed interface for Screenshot Analysis results</li>
                      <li>Enhanced tone analysis in Screenshot Analysis</li>
                      <li>Added pattern recognition for common phrases</li>
                      <li>Improved loading states and progress indicators</li>
                      <li>Enhanced error handling and user feedback</li>
                      <li>Added explanatory tooltips and help text</li>
                      <li>Improved accessibility across all components</li>
                      <li>Enhanced dark mode support</li>
                      <li>Added animated transitions between states</li>
                      <li>Improved data visualization components</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <Rocket className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Future Plans</h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-600">
                      <li>Implement multi-language support for chat analysis</li>
                      <li>Add support for more messaging platforms</li>
                      <li>Develop advanced AI-powered conversation suggestions</li>
                      <li>Create shareable report templates</li>
                      <li>Add conversation comparison features</li>
                      <li>Implement real-time analysis capabilities</li>
                      <li>Add support for voice message transcription</li>
                      <li>Develop relationship timeline visualization</li>
                      <li>Add support for group chat analysis</li>
                      <li>Implement conversation search and filtering</li>
                      <li>Add custom tagging and categorization</li>
                      <li>Develop conversation health monitoring</li>
                      <li>Add support for data export in multiple formats</li>
                      <li>Implement conversation backup features</li>
                      <li>Add advanced privacy controls and encryption</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

