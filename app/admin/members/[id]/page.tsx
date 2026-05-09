// ==============================
// EditMemberPage.tsx
// ==============================

'use client'


import { useEffect, useState } from 'react'
import {
  useRouter,
  useParams,
} from 'next/navigation'

// Utility to format labels
function formatLabel(str: string) {
  const withSpaces = str.replace(
    /([A-Z])/g,
    ' $1'
  )

  return (
    withSpaces.charAt(0).toUpperCase() +
    withSpaces.slice(1)
  )
}

// Utility to format dates
function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
}

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()

  const [form, setForm] =
    useState<any>({})

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!params?.id) return

    fetch(`/api/members/${params.id}`)
      .then((res) => res.json())
      .then(setForm)
  }, [params?.id])

  async function handleSubmit(e: any) {
    e.preventDefault()

    setError(null)

    const {
      _id,
      createdAt,
      updatedAt,
      ...payload
    } = form

    const res = await fetch(
      `/api/members/${params.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

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
        Edit Member
      </h1>

      {/* Error Message */}
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      {/* Form Fields */}
      {Object.keys(form)
        .filter(
          (key) =>
            ![
              '_id',
              'createdAt',
              'updatedAt',
              'contributions',
            ].includes(key)
        )
        .map((key) => (
          <div
            key={key}
            className="form-group"
          >
            <label className="form-label">
              {formatLabel(key)}
            </label>

            <input
              type={
                key === 'contribution'
                  ? 'number'
                  : 'text'
              }
              value={form[key] ?? ''}
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

      {/* Read-only timestamps */}
      {form.createdAt && (
        <p className="timestamp-text">
          Created:{' '}
          <span className="timestamp-highlight">
            {formatDate(
              form.createdAt
            )}
          </span>
        </p>
      )}

      {form.updatedAt && (
        <p className="timestamp-text">
          Last Updated:{' '}
          <span className="timestamp-highlight">
            {formatDate(
              form.updatedAt
            )}
          </span>
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="primary-btn"
      >
        Update
      </button>
    </form>
  )
}