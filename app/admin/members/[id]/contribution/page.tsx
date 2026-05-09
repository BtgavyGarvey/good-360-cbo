// ==============================
// ContributionEntryPage.tsx
// ==============================

'use client'


import { useEffect, useState } from 'react'
import {
  useRouter,
  useParams,
} from 'next/navigation'

export default function ContributionEntryPage() {
  const router = useRouter()
  const params = useParams()

  const [member, setMember] =
    useState<any>(null)

  const [month, setMonth] =
    useState('')

  const [amount, setAmount] =
    useState<number>(0)

  // Load member data
  useEffect(() => {
    if (!params?.id) return

    fetch(`/api/members/${params.id}`)
      .then((res) => res.json())
      .then(setMember)
  }, [params?.id])

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (!month || !amount) return

    await fetch(
      `/api/members/${params.id}/contributions`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          month,
          amount,
        }),
      }
    )

    router.push(
      '/admin/members/' +
        params.id +
        '/contributions'
    )
  }

  return (
    <div className="form-page">
      <h1 className="page-title">
        Record Contribution
      </h1>

      {member && (
        <form
          onSubmit={handleSubmit}
          className="form-container"
        >
          {/* Month */}
          <div className="form-group">
            <label className="form-label">
              Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) =>
                setMonth(
                  e.target.value
                )
              }
              className="form-input"
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Number(
                    e.target.value
                  )
                )
              }
              className="form-input"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="primary-btn"
          >
            Save Contribution
          </button>
        </form>
      )}

      {/* Existing Contributions */}
      {member?.contributions
        ?.length > 0 && (
        <div className="card">
          <h2 className="section-title">
            Existing Contributions
          </h2>

          <ul className="contribution-list">
            {member.contributions.map(
              (
                c: any,
                idx: number
              ) => (
                <li
                  key={idx}
                  className="contribution-item"
                >
                  <span>
                    {c.month}
                  </span>

                  <span className="amount-highlight">
                    {c.amount}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  )
}