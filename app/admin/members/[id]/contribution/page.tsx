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

    alert(
      `Saving contribution for ${month} with amount ${amount}`
    )

    return

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
          <div className="month-year-group">

            {/* Month Select */}
            <select
              value={month.split('-')[1] || ''}
              onChange={(e) => {
                const yearPart =
                  month.split('-')[0] ||
                  new Date()
                    .getFullYear()
                    .toString()

                setMonth(
                  `${yearPart}-${e.target.value}`
                )
              }}
              className="form-input"
            >
              <option value="">
                Select Month
              </option>

              <option value="01">
                January
              </option>

              <option value="02">
                February
              </option>

              <option value="03">
                March
              </option>

              <option value="04">
                April
              </option>

              <option value="05">
                May
              </option>

              <option value="06">
                June
              </option>

              <option value="07">
                July
              </option>

              <option value="08">
                August
              </option>

              <option value="09">
                September
              </option>

              <option value="10">
                October
              </option>

              <option value="11">
                November
              </option>

              <option value="12">
                December
              </option>
            </select>

            {/* Year Select */}
            <select
              value={month.split('-')[0] || ''}
              onChange={(e) => {
                const monthPart =
                  month.split('-')[1] || '01'

                setMonth(
                  `${e.target.value}-${monthPart}`
                )
              }}
              className="form-input"
            >
              {Array.from(
                {
                  length:
                    new Date().getFullYear() -
                    2026 +
                    1,
                },
                (_, i) => 2026 + i
              ).map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

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