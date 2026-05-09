'use client'
import { signIn } from 'next-auth/react'
import { ShieldAlert, LogIn } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <ShieldAlert className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in with Google to manage members</p>
        </div>
        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login with Google
        </button>
      </div>
    </div>
  )
}
