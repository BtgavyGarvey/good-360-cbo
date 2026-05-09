// ==============================
// MemberContributionsPage.tsx
// ==============================

'use client'


import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export default function MemberContributionsPage() {
  const params = useParams()

  const currentYear =
    new Date().getFullYear().toString()

  const [member, setMember] =
    useState<any>(null)

  const [year, setYear] =
    useState<string>(currentYear)

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [data, setData] = useState<any[]>(
    []
  )

  useEffect(() => {
    if (!params?.id) return

    fetch(
      `/api/members/${params.id}/contributions/summary`
    )
      .then((res) => res.json())
      .then((res) =>
        setData(res.yearlyTotals)
      )
  }, [params?.id])

  async function fetchContributions(
    selectedYear = year,
    pageNum = page
  ) {
    const res = await fetch(
      `/api/members/${params.id}/contributions?year=${selectedYear}&page=${pageNum}&limit=12`
    )

    const data = await res.json()

    setMember({
      ...member,
      contributions:
        data.contributions,
      ...data.member,
    })

    setPages(data.pages)
    setPage(data.page)
  }

  useEffect(() => {
    if (!params?.id) return

    fetchContributions(year, page)
  }, [params?.id, year, page])

  if (!member)
    return <p>Loading...</p>

  const chartData =
    member.contributions.map(
      (c: any) => ({
        month: new Date(
          c.month
        ).toLocaleString('default', {
          month: 'short',
        }),

        amount: c.amount,
      })
    )

  const total =
    member.contributions.reduce(
      (sum: number, c: any) =>
        sum + c.amount,
      0
    )

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Contributions for{' '}
          {member.fullName} #
          {member.memberNumber}
        </h1>

        <Link
          href={`/admin/members/${member._id}/contribution`}
          className="primary-btn"
        >
          Add Contribution
        </Link>
      </div>

      {/* Year Selector */}
      <div className="filter-group">
        <label className="form-label">
          Select Year
        </label>

        <select
          value={year}
          onChange={(e) => {
            setYear(
              e.target.value
            )

            setPage(1)
          }}
          className="form-select"
        >
          {Array.from(
            {
              length:
                new Date().getFullYear() -
                2026 +
                1,
            },
            (_, i) => 2026 + i
          ).map((y) => (
            <option
              key={y}
              value={y.toString()}
            >
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="card">
        <p className="summary-text">
          Total Contributions (
          {year}):{' '}
          <span className="summary-highlight">
            {total}
          </span>
        </p>

        <p className="summary-subtext">
          Across{' '}
          {
            member.contributions
              .length
          }{' '}
          months
        </p>
      </div>

      {/* Monthly Contributions */}
      <div className="card">
        <h2 className="section-title">
          Monthly Contributions (
          {year})
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
                  {new Date(
                    c.month
                  ).toLocaleString(
                    'default',
                    {
                      month: 'long',
                    }
                  )}
                </span>

                <span className="amount-highlight">
                  {c.amount}
                </span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Trend Chart */}
      <div className="chart-card">
        <h2 className="section-title">
          Contribution Trend (
          {year})
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={chartData}>
            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Comparison */}
      <YearlyComparison data={data} />

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="pagination-btn"
        >
          Prev
        </button>

        <span className="pagination-text">
          Page {page} of {pages}
        </span>

        <button
          disabled={page >= pages}
          onClick={() =>
            setPage(page + 1)
          }
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function YearlyComparison({
  data,
}: any) {
  if (!data.length)
    return (
      <p>
        Loading yearly totals...
      </p>
    )

  return (
    <div className="chart-card">
      <h2 className="section-title">
        Year-over-Year Comparison
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="year" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="total"
            fill="#22c55e"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}