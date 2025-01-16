import { SignupForm } from '@/components/SignupForm'
import { PageTransition } from '@/components/page-transition'

export default function SignupPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-600">Join us to get started with InstaWrapped</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </PageTransition>
  )
}

