'use client'

import '../admin-layout.css'

import { signIn, useSession } from 'next-auth/react'
import { Shield, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()

  // safer redirect (no render loop)
  useEffect(() => {
    if (session) {
      router.push('/admin')
    }
  }, [session, router])

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Icon */}
        <div className="login-icon-wrapper">
          <Shield className="login-icon" />
        </div>

        {/* Title */}
        <h2 className="login-title">
          GOOD 360 CBO
        </h2>

        <p className="login-subtitle">
          Admin Portal Access
        </p>

        <p className="login-description">
          Secure sign-in required to manage members, contributions, and system records.
        </p>

        {/* Login Button */}
        <button
          onClick={() => signIn('google')}
          className="login-button"
        >
          <LogIn className="login-button-icon" />
          Continue with Google
        </button>

        {/* Terms + Privacy */}
        <div className="login-links">
          <Link href="/terms" className="login-link">
            Terms & Conditions
          </Link>

          <span className="login-link-separator">•</span>

          <Link href="/privacy" className="login-link">
            Privacy Policy
          </Link>
        </div>

        {/* Footer note */}
        <p className="login-footer">
          Authorized personnel only
        </p>

      </div>
    </div>
  )
}