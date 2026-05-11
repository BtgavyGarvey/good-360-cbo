// ==============================
// ContributionsPage.tsx
// ==============================

'use client'

// import './admin-layout.css'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function ContributionsPage() {
  const [data, setData] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [year, setYear] = useState(
    new Date().getFullYear().toString()
  )

  async function fetchData(
    selectedYear = year,
    pageNum = page
  ) {
    const res = await fetch(
      `/api/members/contributions?year=${selectedYear}&page=${pageNum}&limit=12`
    )

    const json = await res.json()
    setData(json)
  }

  useEffect(() => {
    fetchData(year, page)
  }, [year, page])

  if (!data) return <p>Loading...</p>

  const members = data.members || []

  const barData = members.map((m: any) => ({
    name: m.fullName,
    contribution: m.total,
  }))

  const totalContribution = members.reduce(
    (sum: number, m: any) => sum + m.total,
    0
  )

  const churchData = Object.values(
    members.reduce((acc: any, m: any) => {
      const churchName = m.church || 'Unknown'

      acc[churchName] =
        acc[churchName] || {
          name: churchName,
          value: 0,
        }

      acc[churchName].value += m.total

      return acc
    }, {})
  )

  const COLORS = [
    '#6366f1',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#14b8a6',
  ]

  function getMonthContribution(
    contributions: any[],
    monthIndex: number
  ) {
    const entry = contributions.find(
      (c: any) =>
        new Date(c.month).getMonth() === monthIndex
    )

    return entry ? entry.amount : 0
  }

  return (
    <div className="page-container">
      <h1 className="page-title">
        Contribution Tracking ({year})
      </h1>

      <div className="filter-group">
        <label className="form-label">
          Select Year
        </label>

        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value)
            setPage(1)
          }}
          className="form-select"
        >
          {Array.from(
            {
              length:
                new Date().getFullYear() - 2026 + 1,
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

      <div className="card">
        <p className="summary-text">
          Total Contribution:{' '}
          <span className="summary-highlight">
            {totalContribution}
          </span>
        </p>

        <p className="summary-subtext">
          Across {members.length} members
          (Page {data.page} of {data.pages})
        </p>
      </div>

      <div className="table-card">
        <h2 className="section-title">
          Contributors Breakdown ({year})
        </h2>

        <table className="data-table">
          <thead className="table-head">
            <tr>
              <th>Member</th>

              {[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ].map((m) => (
                <th
                  key={m}
                  className="table-center"
                >
                  {m}
                </th>
              ))}

              <th className="table-center">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {members.map((m: any) => (
              <tr key={m._id}>
                <td className="member-cell">
                  <Link
                    href={`/admin/members/${m._id}/contributions`}
                    className="link-primary"
                  >
                    {m.memberNumber}
                  </Link>

                  <br />

                  {m.fullName}
                </td>

                {Array.from({
                  length: 12,
                }).map((_, idx) => {
                  const amount =
                    getMonthContribution(
                      m.contributions,
                      idx
                    )

                  const isZero =
                    amount === 0

                  return (
                    <td
                      key={idx}
                      className={`table-center ${
                        isZero
                          ? 'zero-cell'
                          : ''
                      }`}
                    >
                      {amount}
                    </td>
                  )
                })}

                <td className="table-center total-cell">
                  {m.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-card">
        <h2 className="section-title">
          Contributions per Member
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="contribution"
              fill="#6366f1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h2 className="section-title">
          Contributions by Church
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={churchData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {churchData.map(
                (_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

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
          Page {data.page} of {data.pages}
        </span>

        <button
          disabled={page >= data.pages}
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