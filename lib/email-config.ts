import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function updateEmailTemplate() {
  const { error } = await supabase.auth.admin.updateConfig({
    email_template: {
      "confirmation": {
        "subject": "Confirm your email for InstaWrapped",
        "content_path": "email-templates/confirmation",
        "button_text": "Confirm Email",
        "redirect_to": "https://your-domain.com/auth/confirm", // Update this with your actual domain
      }
    }
  })

  if (error) {
    console.error('Error updating email template:', error)
    throw error
  }
}

