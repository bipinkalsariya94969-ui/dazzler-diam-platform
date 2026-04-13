'use client'
import { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_PRODUCTS = [
  { _id: '1', name: 'Eclipse Solitaire', category: 'Rings', carat: '2.00', color: 'D', clarity: 'VVS1', certification: 'GIA', metal: '18ct Platinum', isPublished: true, isFeatured: true, isSpotlight: false },
  { _id: '2', name: 'Celestial Cascade', category: 'Necklaces', carat: '2.40', color: 'F', clarity: 'VS1', certification: 'IGI', metal: '18ct Rose Gold', isPublished: true, isFeatured: false, isSpotlight: true },
  { _id: '3', name: 'Aurora Studs', category: 'Earrings', carat: '1.00', color: 'E', clarity: 'VVS2', certification: 'IGI', metal: '18ct White Gold', isPublished: false, isFeatured: false, isSpotlight: false },
]

const CATEGORIES = ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants', 'Bangles', 'Custom']

export default function ProductsAdminPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null)
  const [form, setForm] = useState({
    name: '', category: 'Rings', carat: '', color: 'D', clarity: 'VVS1',
    certification: 'IGI', metal: '18ct Yellow Gold', description: '',
    isPublished: false, isFeatured: false, isSpotlight: false,
  })

  const openNew = () => {
    setForm({ name: '', category: 'Rings', carat: '', color: 'D', clarity: 'VVS1', certification: 'IGI', metal: '18ct Yellow Gold', description: '', isPublished: false, isFeatured: false, isSpotlight: false })
    setEditingProduct(null)
    setShowForm(true)
  }

  const openEdit = (p: typeof MOCK_PRODUCTS[0]) => {
    setForm({ name: p.name, category: p.category, carat: p.carat, color: p.color, clarity: p.clarity, certification: p.certification, metal: p.metal, description: '', isPublished: p.isPublished, isFeatured: p.isFeatured, isSpotlight: p.isSpotlight })
    setEditingProduct(p)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name) { toast.error('Name is required'); return }
    if (editingProduct) {
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...form } : p))
      toast.success('Product updated')
    } else {
      setProducts(prev => [...prev, { _id: Date.now().toString(), ...form }])
      toast.success('Product created')
    }
    setShowForm(false)
  }

  const togglePublish = (id: string) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, isPublished: !p.isPublished } : p))
  }
  const toggleFeatured = (id: string) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, isFeatured: !p.isFeatured } : p))
  }
  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return
    setProducts(prev => prev.filter(p => p._id !== id))
    toast.success('Product deleted')
  }

  if (showForm) {
    return (
      <AdminLayout>
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-light text-white">{editingProduct ? 'Edit Product' : 'New Product'}</h1>
            <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white text-[12px] font-montserrat">← Back</button>
          </div>

          <div className="admin-card p-8 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Product Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-luxury" placeholder="e.g. Eclipse Solitaire Ring" />
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-luxury">
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Certification</label>
                <select value={form.certification} onChange={e => setForm(p => ({ ...p, certification: e.target.value }))} className="input-luxury">
                  {['IGI', 'GIA'].map(c => <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Carat Weight</label>
                <input value={form.carat} onChange={e => setForm(p => ({ ...p, carat: e.target.value }))} className="input-luxury" placeholder="e.g. 2.00" />
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Colour</label>
                <select value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="input-luxury">
                  {['D', 'E', 'F', 'G'].map(c => <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Clarity</label>
                <select value={form.clarity} onChange={e => setForm(p => ({ ...p, clarity: e.target.value }))} className="input-luxury">
                  {['VVS1', 'VVS2', 'VS1', 'VS2'].map(c => <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Metal</label>
                <select value={form.metal} onChange={e => setForm(p => ({ ...p, metal: e.target.value }))} className="input-luxury">
                  {['18ct Yellow Gold', '18ct White Gold', '18ct Rose Gold', '14ct Yellow Gold', '22ct Yellow Gold', 'Platinum'].map(m => <option key={m} value={m} style={{ background: '#0d0d0d' }}>{m}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-luxury resize-none" rows={3} placeholder="Product description..." />
              </div>
            </div>

            <div className="flex gap-6 pt-4 border-t" style={{ borderColor: 'rgba(216,154,24,0.1)' }}>
              {[
                { key: 'isPublished', label: 'Published' },
                { key: 'isFeatured', label: 'Featured' },
                { key: 'isSpotlight', label: 'Spotlight' },
              ].map(toggle => (
                <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setForm(p => ({ ...p, [toggle.key]: !p[toggle.key as keyof typeof p] }))}
                    className="w-9 h-5 rounded-full relative transition-colors"
                    style={{ background: form[toggle.key as keyof typeof form] ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: form[toggle.key as keyof typeof form] ? 'translateX(17px)' : 'translateX(2px)' }} />
                  </div>
                  <span className="text-[12px] font-montserrat text-white/60">{toggle.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setShowForm(false)} className="btn-luxury text-[10px] py-2 px-6" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(240,236,228,0.4)' }}>Cancel</button>
              <button onClick={handleSave} className="btn-luxury btn-luxury-fill text-[10px] py-2 px-8">Save Product</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-light text-white">Products</h1>
            <p className="text-[12px] font-montserrat text-white/40 mt-1">{products.length} total pieces</p>
          </div>
          <button onClick={openNew} className="btn-luxury text-[10px] py-2 px-5 flex items-center gap-2">
            <Plus size={12} /> Add Product
          </button>
        </div>

        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(216,154,24,0.1)' }}>
                {['Product', 'Category', 'Specs', 'Certification', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] font-montserrat tracking-widest uppercase text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(216,154,24,0.05)' }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rotate-45 flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(216,154,24,0.3), rgba(249,240,204,0.5))' }} />
                      <div>
                        <p className="text-[13px] font-montserrat text-white">{p.name}</p>
                        {p.isFeatured && <span className="text-[9px] text-gold-400">★ Featured</span>}
                        {p.isSpotlight && <span className="text-[9px] text-purple-400 ml-2">◈ Spotlight</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[12px] font-montserrat text-white/60">{p.category}</td>
                  <td className="px-5 py-4 text-[12px] font-montserrat text-white/60">{p.carat}ct · {p.color} · {p.clarity}</td>
                  <td className="px-5 py-4">
                    <span className="text-[9px] font-montserrat tracking-widest uppercase px-2 py-1" style={{
                      background: p.certification === 'IGI' ? 'rgba(56,189,248,0.1)' : 'rgba(34,197,94,0.1)',
                      color: p.certification === 'IGI' ? '#38bdf8' : '#22c55e',
                    }}>{p.certification}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => togglePublish(p._id)} className="text-[9px] font-montserrat tracking-widest uppercase px-3 py-1 transition-all" style={{
                      background: p.isPublished ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                      color: p.isPublished ? '#4ade80' : 'rgba(240,236,228,0.3)',
                      border: `1px solid ${p.isPublished ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    }}>{p.isPublished ? 'Live' : 'Draft'}</button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-white/30 hover:text-gold-400 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
