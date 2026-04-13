'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Package, Users, Calendar,
  Truck, Handshake, FileText, Settings, LogOut, Menu, X,
  Star, Globe, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { label: 'Collaborations', href: '/admin/collaborations', icon: Handshake },
  { label: 'Team', href: '/admin/team', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    // Check auth token
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    if (!token) {
      router.push('/admin/login')
      return
    }
    if (userData) setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060606', color: '#f0ece4' }}>
      {/* Sidebar */}
      <aside
        className={`admin-sidebar flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}
        style={{ flexShrink: 0 }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: 'rgba(216,154,24,0.1)' }}
        >
          <div
            className="w-8 h-8 rotate-45 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(216,154,24,0.8), rgba(249,240,204,0.9))' }}
          />
          {sidebarOpen && (
            <div>
              <p className="font-display text-sm font-light text-white tracking-widest">DAZZLER DIAM</p>
              <p className="text-[8px] font-montserrat tracking-widest uppercase text-gold-400">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-white/30 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded transition-all duration-200 group"
                style={{
                  background: active ? 'rgba(216,154,24,0.1)' : 'transparent',
                  borderLeft: active ? '2px solid var(--color-gold)' : '2px solid transparent',
                }}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon
                  size={16}
                  style={{ color: active ? 'var(--color-gold)' : 'rgba(240,236,228,0.4)', flexShrink: 0 }}
                />
                {sidebarOpen && (
                  <span
                    className="text-[12px] font-montserrat font-light tracking-wider"
                    style={{ color: active ? 'var(--color-gold)' : 'rgba(240,236,228,0.6)' }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'rgba(216,154,24,0.1)' }}
        >
          {sidebarOpen && user && (
            <div className="mb-3">
              <p className="text-[12px] font-montserrat text-white/80">{user.name}</p>
              <p className="text-[10px] font-montserrat tracking-widest uppercase text-gold-400/60">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            {sidebarOpen && <span className="text-[11px] font-montserrat">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b"
          style={{ background: '#060606', borderColor: 'rgba(216,154,24,0.08)' }}
        >
          <div className="flex items-center gap-2 text-[11px] font-montserrat text-white/30">
            {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
              <span key={seg} className="flex items-center gap-2">
                <span className={i === arr.length - 1 ? 'text-gold-400' : ''}>{seg.charAt(0).toUpperCase() + seg.slice(1)}</span>
                {i < arr.length - 1 && <ChevronRight size={10} />}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-[10px] font-montserrat tracking-widest uppercase text-white/30 hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              <Globe size={12} /> View Site
            </Link>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
