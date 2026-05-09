// ==============================
// AdminDashboardPage.tsx
// ==============================

'use client'


import { useEffect, useState } from 'react'

import {
  Users,
  BarChart3,
  Activity,
  ShieldCheck,
} from 'lucide-react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts'

import Link from 'next/link'

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(setStats)
  }, [])

  if (!stats)
    return <p>Loading dashboard...</p>

  const barData =
    stats.topMembers.map((m: any) => ({
      name: m.fullName,
      contribution: m.total,
    }))

  const lineData =
    stats.monthlyTrend.map((m: any) => ({
      month: m.month,
      total: m.total,
    }))

  return (
    <div className="page-container">
      {/* Page Title */}
      <h1 className="page-title">
        Admin Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        {/* Members */}
        <div className="stats-card">
          <div className="stats-header stats-indigo">
            <Users size={20} />
            <span>Members</span>
          </div>

          <p className="stats-number">
            {stats.totalMembers}
          </p>
        </div>

        {/* Contributions */}
        <div className="stats-card">
          <div className="stats-header stats-green">
            <BarChart3 size={20} />
            <span>Contributions</span>
          </div>

          <p className="stats-number">
            {stats.totalContributions}
          </p>
        </div>

        {/* Users */}
        <div className="stats-card">
          <div className="stats-header stats-yellow">
            <ShieldCheck size={20} />
            <span>Users</span>
          </div>

          <p className="stats-number">
            {stats.totalUsers}
          </p>
        </div>

        {/* Audit Logs */}
        <div className="stats-card">
          <div className="stats-header stats-red">
            <Activity size={20} />
            <span>Audit Logs</span>
          </div>

          <p className="stats-number">
            {stats.totalLogs}
          </p>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="chart-card">
        <h2 className="section-title">
          Top Contributors (
          {stats.year})
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

      {/* Monthly Trend */}
      <div className="chart-card">
        <h2 className="section-title">
          Monthly Contribution Trend (
          {stats.year})
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={lineData}>
            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#22c55e"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Links */}
      <div className="quick-links-grid">
        {/* Members */}
        <Link
          href="/admin/members"
          className="quick-link-card quick-indigo"
        >
          <h3 className="quick-link-title">
            Manage Members
          </h3>

          <p className="quick-link-text">
            Add, edit, and view all
            members.
          </p>
        </Link>

        {/* Contributions */}
        <Link
          href="/admin/contributions"
          className="quick-link-card quick-green"
        >
          <h3 className="quick-link-title">
            Track Contributions
          </h3>

          <p className="quick-link-text">
            View contributions by
            member and year.
          </p>
        </Link>

        {/* Audit */}
        <Link
          href="/admin/audit"
          className="quick-link-card quick-red"
        >
          <h3 className="quick-link-title">
            Audit Logs
          </h3>

          <p className="quick-link-text">
            Track all admin actions
            for transparency.
          </p>
        </Link>
      </div>
    </div>
  )
}