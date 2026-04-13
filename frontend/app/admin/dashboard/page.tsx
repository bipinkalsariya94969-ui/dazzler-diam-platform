'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import { MessageSquare, Package, Calendar, Users, TrendingUp, Globe, Star, Clock } from 'lucide-react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const mockStats = {
  inquiries: 48,
  products: 24,
  appointments: 7,
  suppliers: 12,
  inquiryTrend: [
    { month: 'Aug', count: 8 }, { month: 'Sep', count: 14 }, { month: 'Oct', count: 11 },
    { month: 'Nov', count: 19 }, { month: 'Dec', count: 24 }, { month: 'Jan', count: 31 },
  ],
  recentInquiries: [
    { name: 'Sarah J.', country: 'USA', product: 'Eclipse Solitaire', status: 'new', time: '2h ago' },
    { name: 'Priya M.', country: 'UK', product: 'Custom Ring', status: 'contacted', time: '5h ago' },
    { name: 'Ahmad K.', country: 'Dubai', product: 'Tennis Bracelet', status: 'new', time: '8h ago' },
    { name: 'Li W.', country: 'Hong Kong', product: 'Drop Earrings', status: 'quoted', time: '1d ago' },
    { name: 'Emma R.', country: 'Canada', product: 'Celestial Band', status: 'closed', time: '2d ago' },
  ],
}

const STATUS_COLORS: Record<string, string> = {
  new: '#38bdf8', contacted: '#edca57', quoted: '#a78bfa', closed: '#4ade80',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats)

  const statCards = [
    { label: 'Total Inquiries', value: stats.inquiries, icon: MessageSquare, trend: '+24%', color: '#38bdf8' },
    { label: 'Products Listed', value: stats.products, icon: Package, trend: '+3', color: '#edca57' },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, trend: 'This week', color: '#a78bfa' },
    { label: 'Active Suppliers', value: stats.suppliers, icon: Truck, trend: '5 countries', color: '#4ade80' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-light text-white">Dashboard</h1>
          <p className="text-[12px] font-montserrat text-white/40 mt-1 tracking-wider">
            Welcome back — here's what's happening with Dazzler Diam Jewels
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="admin-card p-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <Icon size={16} style={{ color: card.color }} />
                  <span
                    className="text-[9px] font-montserrat tracking-wider px-2 py-1 rounded"
                    style={{ background: `${card.color}15`, color: card.color }}
                  >
                    {card.trend}
                  </span>
                </div>
                <div>
                  <p className="font-display text-3xl font-light text-white">{card.value}</p>
                  <p className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 mt-1">{card.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiry trend */}
          <div className="admin-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-montserrat tracking-widest uppercase text-white/60">Inquiry Trend</h3>
              <span className="text-[10px] font-montserrat text-gold-400">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats.inquiryTrend}>
                <XAxis dataKey="month" tick={{ fill: 'rgba(240,236,228,0.3)', fontSize: 10, fontFamily: 'var(--font-montserrat)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(240,236,228,0.3)', fontSize: 10, fontFamily: 'var(--font-montserrat)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(216,154,24,0.2)', borderRadius: 4, fontFamily: 'var(--font-montserrat)', fontSize: 11 }}
                  labelStyle={{ color: 'rgba(240,236,228,0.6)' }}
                  itemStyle={{ color: '#d89a18' }}
                />
                <Line type="monotone" dataKey="count" stroke="#d89a18" strokeWidth={2} dot={{ fill: '#d89a18', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Country breakdown */}
          <div className="admin-card p-6">
            <h3 className="text-[10px] font-montserrat tracking-widest uppercase text-white/60 mb-6">By Country</h3>
            <div className="space-y-4">
              {[
                { country: 'USA', count: 18, pct: 37 },
                { country: 'UAE / Dubai', count: 12, pct: 25 },
                { country: 'UK', count: 9, pct: 19 },
                { country: 'Canada', count: 6, pct: 13 },
                { country: 'Hong Kong', count: 3, pct: 6 },
              ].map(item => (
                <div key={item.country}>
                  <div className="flex justify-between text-[11px] font-montserrat mb-1">
                    <span className="text-white/60">{item.country}</span>
                    <span className="text-gold-400">{item.count}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'rgba(216,154,24,0.1)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.pct}%`, background: 'var(--color-gold)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="admin-card">
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(216,154,24,0.1)' }}>
            <h3 className="text-[10px] font-montserrat tracking-widest uppercase text-white/60">Recent Inquiries</h3>
            <a href="/admin/inquiries" className="text-[10px] font-montserrat text-gold-400 tracking-wider hover:underline">
              View all
            </a>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
            {stats.recentInquiries.map((inq, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                style={{ borderColor: 'rgba(216,154,24,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-montserrat font-medium"
                    style={{ background: 'rgba(216,154,24,0.1)', color: 'var(--color-gold)' }}
                  >
                    {inq.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-montserrat text-white">{inq.name}</p>
                    <p className="text-[11px] font-montserrat text-white/40">{inq.product} · {inq.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="text-[9px] font-montserrat tracking-widest uppercase px-3 py-1"
                    style={{
                      background: `${STATUS_COLORS[inq.status]}15`,
                      color: STATUS_COLORS[inq.status],
                      border: `1px solid ${STATUS_COLORS[inq.status]}30`,
                    }}
                  >
                    {inq.status}
                  </span>
                  <span className="text-[11px] font-montserrat text-white/25">{inq.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function Truck(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
}
