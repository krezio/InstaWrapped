import { Html } from '@react-email/html'
import { Button } from '@react-email/button'
import { Head } from '@react-email/head'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import { Container } from '@react-email/container'
import { Img } from '@react-email/img'

interface EmailTemplateProps {
  confirmationUrl: string
  userEmail: string
}

export default function ConfirmationEmail({
  confirmationUrl,
  userEmail
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address for InstaWrapped</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src="https://your-domain.com/logo.png"
              width="40"
              height="40"
              alt="InstaWrapped"
              style={logo}
            />
          </Section>

          <Section style={contentSection}>
            <Text style={heading}>Welcome to InstaWrapped!</Text>
            <Text style={paragraph}>
              Thanks for signing up! We're excited to have you join us. Please confirm your email address to get started.
            </Text>
            <Button pX={20} pY={12} style={button} href={confirmationUrl}>
              Confirm Email Address
            </Button>
            <Text style={paragraph}>
              This link will expire in 24 hours. If you didn't create an account with InstaWrapped, you can safely ignore this email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} InstaWrapped. All rights reserved.
            </Text>
            <Text style={footerText}>
              You're receiving this email because you signed up for InstaWrapped.
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '12px',
  maxWidth: '580px',
  width: '100%',
}

const headerSection = {
  padding: '24px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const contentSection = {
  padding: '0 48px',
}

const heading = {
  fontSize: '30px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  textAlign: 'center' as const,
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#ec4899',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  maxWidth: '280px',
  margin: '24px auto',
  padding: '12px 20px',
}

const footer = {
  padding: '0 48px',
  marginTop: '32px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#9BA2B0',
  textAlign: 'center' as const,
}

