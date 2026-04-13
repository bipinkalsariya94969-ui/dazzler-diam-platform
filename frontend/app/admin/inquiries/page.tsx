'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import { Search, Filter, Download, Eye, Edit2, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'new', 'contacted', 'quoted', 'in-progress', 'closed', 'cancelled']
const STATUS_COLORS: Record<string, string> = {
  new: '#38bdf8', contacted: '#edca57', quoted: '#a78bfa',
  'in-progress': '#fb923c', closed: '#4ade80', cancelled: '#f87171',
}
const COUNTRIES = ['All', 'USA', 'UK', 'Canada', 'UAE / Dubai', 'Hong Kong']

const MOCK_INQUIRIES = [
  { _id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555 0101', country: 'USA', product: 'Eclipse Solitaire Ring', carat: '2.00', color: 'D', clarity: 'VVS1', certification: 'GIA', metal: '18ct Platinum', estimatedPrice: { total: 18500 }, status: 'new', createdAt: '2025-01-15T10:30:00Z', notes: 'For engagement, needs it in 6 weeks' },
  { _id: '2', name: 'Priya Mehta', email: 'priya@email.com', phone: '+44 7700 000001', country: 'UK', product: 'Custom Cushion Ring', carat: '1.50', color: 'E', clarity: 'VVS2', certification: 'IGI', metal: '18ct Rose Gold', estimatedPrice: { total: 9200 }, status: 'contacted', createdAt: '2025-01-14T08:00:00Z', notes: '' },
  { _id: '3', name: 'Ahmad Al-Rashid', email: 'ahmad@email.com', phone: '+971 50 000 0001', country: 'UAE / Dubai', product: 'Tennis Bracelet', carat: '5.00', color: 'F', clarity: 'VS1', certification: 'IGI', metal: '18ct Yellow Gold', estimatedPrice: { total: 24000 }, status: 'quoted', createdAt: '2025-01-13T14:00:00Z', notes: 'Wants 50 stones, pavé setting' },
  { _id: '4', name: 'Li Wei', email: 'liwei@email.com', phone: '+852 9000 0001', country: 'Hong Kong', product: 'Drop Earrings', carat: '0.80', color: 'G', clarity: 'VS2', certification: 'GIA', metal: '18ct White Gold', estimatedPrice: { total: 4800 }, status: 'in-progress', createdAt: '2025-01-12T11:00:00Z', notes: '' },
  { _id: '5', name: 'Emma Roberts', email: 'emma@email.com', phone: '+1 604 000 0001', country: 'Canada', product: 'Celestial Band', carat: '1.80', color: 'D', clarity: 'VVS1', certification: 'GIA', metal: '18ct Yellow Gold', estimatedPrice: { total: 16200 }, status: 'closed', createdAt: '2025-01-10T09:00:00Z', notes: 'Order complete, shipped Jan 20' },
]

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES)
  const [filtered, setFiltered] = useState(MOCK_INQUIRIES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('All')
  const [selectedInquiry, setSelectedInquiry] = useState<typeof MOCK_INQUIRIES[0] | null>(null)

  useEffect(() => {
    let result = inquiries
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase()))
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter)
    if (countryFilter !== 'All') result = result.filter(i => i.country === countryFilter)
    setFiltered(result)
  }, [search, statusFilter, countryFilter, inquiries])

  const updateStatus = async (id: string, status: string) => {
    setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i))
    toast.success('Status updated')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-light text-white">Inquiries</h1>
            <p className="text-[12px] font-montserrat text-white/40 mt-1">{filtered.length} total inquiries</p>
          </div>
          <button className="btn-luxury text-[10px] py-2 px-5 flex items-center gap-2">
            <Download size={12} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-luxury pl-9 py-2.5"
              style={{ fontSize: '12px' }}
            />
          </div>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-2 text-[9px] font-montserrat tracking-widest uppercase transition-all"
                style={{
                  background: statusFilter === s ? (STATUS_COLORS[s] || 'var(--color-gold)') : 'transparent',
                  color: statusFilter === s ? '#050505' : 'rgba(240,236,228,0.4)',
                  border: `1px solid ${statusFilter === s ? (STATUS_COLORS[s] || 'var(--color-gold)') : 'rgba(216,154,24,0.2)'}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="input-luxury py-2 text-[12px]"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(216,154,24,0.1)' }}>
                  {['Client', 'Product', 'Specifications', 'Estimate', 'Country', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[9px] font-montserrat tracking-widest uppercase text-white/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inq => (
                  <tr
                    key={inq._id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(216,154,24,0.05)' }}
                  >
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-montserrat text-white">{inq.name}</p>
                      <p className="text-[11px] font-montserrat text-white/35">{inq.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-montserrat text-white/80">{inq.product}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[11px] font-montserrat text-white/60">
                        {inq.carat}ct · {inq.color} · {inq.clarity}
                      </p>
                      <span
                        className="text-[9px] font-montserrat tracking-widest uppercase px-2 py-0.5"
                        style={{
                          background: inq.certification === 'IGI' ? 'rgba(56,189,248,0.1)' : 'rgba(34,197,94,0.1)',
                          color: inq.certification === 'IGI' ? '#38bdf8' : '#22c55e',
                        }}
                      >
                        {inq.certification}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-montserrat text-gold-400">
                        ${inq.estimatedPrice.total.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-montserrat text-white/60">{inq.country}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={inq.status}
                        onChange={e => updateStatus(inq._id, e.target.value)}
                        className="text-[9px] font-montserrat tracking-widest uppercase px-2 py-1 border outline-none cursor-pointer"
                        style={{
                          background: `${STATUS_COLORS[inq.status]}15`,
                          color: STATUS_COLORS[inq.status],
                          borderColor: `${STATUS_COLORS[inq.status]}30`,
                        }}
                      >
                        {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s} style={{ background: '#0d0d0d', color: '#f0ece4' }}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[11px] font-montserrat text-white/30">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="text-white/30 hover:text-gold-400 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="w-full max-w-2xl admin-card p-8 overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-display text-2xl font-light text-white">{selectedInquiry.name}</h2>
                <p className="text-[11px] font-montserrat text-white/40 mt-1">{selectedInquiry.email} · {selectedInquiry.phone}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-white/30 hover:text-white text-xl leading-none">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Product', value: selectedInquiry.product },
                { label: 'Country', value: selectedInquiry.country },
                { label: 'Carat', value: selectedInquiry.carat + 'ct' },
                { label: 'Colour', value: selectedInquiry.color },
                { label: 'Clarity', value: selectedInquiry.clarity },
                { label: 'Certification', value: selectedInquiry.certification },
                { label: 'Metal', value: selectedInquiry.metal },
                { label: 'Estimate', value: '$' + selectedInquiry.estimatedPrice.total.toLocaleString() },
              ].map(item => (
                <div key={item.label} className="border-t pt-3" style={{ borderColor: 'rgba(216,154,24,0.1)' }}>
                  <p className="text-[9px] font-montserrat tracking-widest uppercase text-white/30">{item.label}</p>
                  <p className="text-[13px] font-montserrat text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {selectedInquiry.notes && (
              <div className="p-4 mb-6" style={{ background: 'rgba(216,154,24,0.04)', border: '1px solid rgba(216,154,24,0.1)' }}>
                <p className="text-[9px] font-montserrat tracking-widest uppercase text-gold-400 mb-2">Notes</p>
                <p className="text-[13px] font-montserrat text-white/70">{selectedInquiry.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <a
                href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}`}
                target="_blank"
                className="btn-luxury flex-1 justify-center text-[10px] py-3"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${selectedInquiry.email}`}
                className="btn-luxury flex-1 justify-center text-[10px] py-3"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
