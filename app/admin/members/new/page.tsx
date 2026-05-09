
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatLabel } from '@/lib/utils'

export default function NewMemberPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    memberNumber: '',
    fullName: '',
    contact: '',
    nationalId: '',
    church: '',
  })

  const [error, setError] = useState<string | null>(
    null
  )

  async function handleSubmit(e: any) {
    e.preventDefault()

    setError(null)

    const res = await fetch('/api/members', {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()

      setError(
        data.error ||
          'An unexpected error occurred.'
      )

      return
    }

    router.push('/admin/members')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container"
    >
      <h1 className="page-title">
        Add New Member
      </h1>

      {/* Error Message */}
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      {/* Form Fields */}
      {Object.keys(form).map((key) => (
        <div
          key={key}
          className="form-group"
        >
          <label className="form-label">
            {formatLabel(key)}
          </label>

          <input
            type="text"
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({
                ...form,
                [key]:
                  e.target.value,
              })
            }
            className="form-input"
          />
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        className="primary-btn"
      >
        Save
      </button>
    </form>
  )
}
