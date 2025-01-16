import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import ConfirmationEmail from '@/email-templates/confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, confirmationUrl } = await request.json()
    
    await resend.emails.send({
      from: 'InstaWrapped <noreply@instawrapped.com>',
      to: email,
      subject: 'Confirm your email for InstaWrapped',
      react: ConfirmationEmail({ confirmationUrl, userEmail: email })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 })
  }
}

