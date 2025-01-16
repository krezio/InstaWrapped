import { Card } from "@/components/ui/card"
import { FileJson, Download, FolderOpen, Upload } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'

export default function HelpPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">How to Get Started</h1>
          
          <div className="grid gap-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <div className="grid gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <Download className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Step 1: Request Your Data</h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Open Instagram on your phone or computer</li>
                      <li>Go to Settings → Privacy and Security</li>
                      <li>Find "Data Download" or "Download Your Information"</li>
                      <li>Select "Request Download"</li>
                      <li>Choose JSON or HTML format</li>
                      <li>Select "Messages" only to speed up the process</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <FileJson className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Step 2: Get Your Files</h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Wait for Instagram's email (usually within a few hours)</li>
                      <li>Click the download link in the email</li>
                      <li>Save the ZIP file to your computer</li>
                      <li>Extract/unzip the downloaded file</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <FolderOpen className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Step 3: Find Your Chat</h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Open the extracted folder</li>
                      <li>Navigate to the "messages" folder</li>
                      <li>For JSON: Find the JSON file for the chat you want to analyze</li>
                      <li>For HTML: Find the HTML file for the chat you want to analyze</li>
                      <li>The filename will include the name of the person you chatted with</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <Upload className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Step 4: Analyze Your Chat</h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Return to InstaWrapped</li>
                      <li>Drop your JSON or HTML file onto the upload area</li>
                      <li>Or click to select the file manually</li>
                      <li>Wait a moment while we analyze your chat</li>
                      <li>Explore your chat insights!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border-0 p-8">
              <h2 className="text-xl font-semibold mb-2">Privacy Note</h2>
              <p className="text-gray-600">
                Your privacy is our top priority. All analysis happens directly in your browser - we never see, store, or transmit your data. 
                Learn more about our privacy practices on our <a href="/privacy" className="text-rose-500 hover:text-rose-600 underline">Privacy page</a>.
              </p>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

