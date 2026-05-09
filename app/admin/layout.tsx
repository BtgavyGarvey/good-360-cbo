'use client'

import '@/app/admin-layout.css'

import {
  Users,
  BarChart3,
  Menu,
  X,
  LayoutDashboard,
  Bell,
  Settings,
  ChevronRight,
  BookOpen,
  LogOut,
} from 'lucide-react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    router.push('/login')
  }
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Members',
      href: '/admin/members',
      icon: Users,
    },
    {
      name: 'Contributions',
      href: '/admin/contributions',
      icon: BarChart3,
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit',
      icon: BookOpen,
    },
    {
      name: 'Sign Out',
      href: '#',
      icon: LogOut,
    },
    // {
    //   name: 'Settings',
    //   href: '/admin/settings',
    //   icon: Settings,
    // },
  ]

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div>
          <h1 className="mobile-title">GOOD 360</h1>
          <p className="mobile-subtitle">Admin Panel</p>
        </div>

        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-icon">G</div>

            <div>
              <h2>GOOD 360 CBO</h2>
              <p>Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              const isLogOut = item.name === 'Sign Out'

              if (isLogOut) {
                return (
                  <button
                    key={item.name}
                    className={`nav-item ${active ? 'active' : ''}`}
                    onClick={() => {
                      signOut()
                      // router.push('/')
                    }}
                  >
                    <div className="nav-left">
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </div>

                    <ChevronRight size={16} />
                  </button>
                )
              }
              else {

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <div className="nav-left">
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </div>

                  <ChevronRight size={16} />
                </Link>
              )
            }
            })}
          </nav>

          {/* User Card */}
          {session?.user && (
            <div className="user-card-wrapper">
              <div className="user-card">
                <div className="user-info">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="user-avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {session.user.name?.charAt(0)}
                    </div>
                  )}

                  <div className="user-details">
                    <h4>{session.user.name}</h4>
                    <p>{session.user.email}</p>
                  </div>
                </div>

                <button className="notification-btn">
                  <Bell size={16} />
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="main-content">
          {/* Desktop Header */}
          <div className="desktop-header">
            <div>
              <h2>Admin Dashboard</h2>
              <p>
                Welcome back, {session?.user?.name || 'Admin'}
              </p>
            </div>

            <div className="desktop-actions">
              <button className="desktop-bell">
                <Bell size={18} />
              </button>

              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="desktop-avatar"
                />
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}