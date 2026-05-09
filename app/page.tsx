'use client'

import './admin-layout.css'

import Link from 'next/link'
import {
  Users,
  BarChart3,
  Shield,
  Activity,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <div className="home-hero">

        <h1 className="home-title">
          GOOD 360 CBO
        </h1>

        <p className="home-subtitle">
          Community-Based Organization Management System
        </p>

        <p className="home-description">
          A secure and centralized platform for managing members, contributions, reporting, and administrative operations.
        </p>

        <div className="home-actions">
          <Link href="/login" className="primary-btn">
             Login
          </Link>

          <Link href="/#" className="secondary-btn">
            Learn More
          </Link>
        </div>

      </div>

      {/* Feature Cards */}
      <div className="home-grid">

        <div className="home-card">
          <Users className="home-icon" />
          <h3>Member Management</h3>
          <p>Register, update, and manage all members in one place.</p>
        </div>

        <div className="home-card">
          <BarChart3 className="home-icon" />
          <h3>Contributions Tracking</h3>
          <p>Monitor monthly and yearly financial contributions with analytics.</p>
        </div>

        <div className="home-card">
          <Activity className="home-icon" />
          <h3>Reports & Insights</h3>
          <p>Visual dashboards for leadership decision-making.</p>
        </div>

        <div className="home-card">
          <Shield className="home-icon" />
          <h3>Secure Access</h3>
          <p>Role-based authentication with secure Google login.</p>
        </div>

      </div>

      {/* Footer */}
      <footer className="home-footer">

        <div className="home-footer-links">
          <Link href="/terms" className="footer-link">
            Terms & Conditions
          </Link>

          <span className="footer-dot">•</span>

          <Link href="/privacy" className="footer-link">
            Privacy Policy
          </Link>
        </div>

        <p className="home-footer-text">
          © {new Date().getFullYear()} GOOD 360 CBO. All rights reserved.
        </p>

      </footer>
    </div>
  )
}