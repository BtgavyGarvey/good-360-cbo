'use client'

import './admin-layout.css'

import { signIn } from 'next-auth/react'
import { Shield, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
export default function LoginPage() {

  const router = useRouter()
    const { data: session } = useSession()
  
    if (session) {
      router.push('/admin')
    }

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

        {/* Button */}
        <button
          onClick={() => signIn('google')}
          className="login-button"
        >
          <LogIn className="login-button-icon" />
          Continue with Google
        </button>

        {/* Footer note */}
        <p className="login-footer">
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}