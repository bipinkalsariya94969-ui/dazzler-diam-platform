'use client'
import { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  coverImage: string
  published: boolean
  createdAt: string
}

const MOCK_POSTS: BlogPost[] = [
  { _id: '1', title: 'IGI vs GIA: Which Certification?', slug: 'igi-vs-gia', excerpt: 'Understanding the two most trusted bodies.', content: '', category: 'Education', coverImage: '', published: true, createdAt: '2025-01-10' },
  { _id: '2', title: 'Rise of Lab-Grown Diamonds', slug: 'lab-grown-luxury', excerpt: 'Redefining luxury without compromise.', content: '', category: 'Trends', coverImage: '', published: true, createdAt: '2025-01-05' },
]

const CATEGORIES = ['Education', 'Trends', 'Guide', 'Behind the Scenes', 'Client Stories', 'Certification']

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isNew, setIsNew] = useState(false)

  const emptyPost: Omit<BlogPost, '_id'> = {
    title: '', slug: '', excerpt: '', content: '', category: 'Education',
    coverImage: '', published: false, createdAt: new Date().toISOString().split('T')[0],
  }

  const [form, setForm] = useState<Omit<BlogPost, '_id'>>(emptyPost)

  const openNew = () => {
    setForm(emptyPost)
    setEditing(null)
    setIsNew(true)
  }

  const openEdit = (post: BlogPost) => {
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, coverImage: post.coverImage, published: post.published, createdAt: post.createdAt })
    setEditing(post)
    setIsNew(false)
  }

  const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleTitleChange = (title: string) => {
    setForm(prev => ({ ...prev, title, slug: slugify(title) }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (isNew) {
      const newPost: BlogPost = { ...form, _id: Date.now().toString() }
      setPosts(prev => [newPost, ...prev])
      toast.success('Post created!')
    } else if (editing) {
      setPosts(prev => prev.map(p => p._id === editing._id ? { ...editing, ...form } : p))
      toast.success('Post updated!')
    }
    setIsNew(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this post?')) return
    setPosts(prev => prev.filter(p => p._id !== id))
    toast.success('Post deleted')
  }

  const togglePublish = (id: string) => {
    setPosts(prev => prev.map(p => p._id === id ? { ...p, published: !p.published } : p))
  }

  if (isNew || editing) {
    return (
      <AdminLayout>
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-light text-white">{isNew ? 'New Post' : 'Edit Post'}</h1>
            <button onClick={() => { setIsNew(false); setEditing(null) }} className="text-white/30 hover:text-white text-[12px] font-montserrat">
              ← Back
            </button>
          </div>

          <div className="admin-card p-8 space-y-6">
            <div>
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Title</label>
              <input
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                className="input-luxury text-base"
                placeholder="Post title..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Slug (Auto)</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-luxury"
                  placeholder="post-url-slug"
                />
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="input-luxury"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Excerpt (SEO Description)</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                className="input-luxury resize-none"
                rows={2}
                placeholder="Short description shown in previews and search results..."
              />
            </div>

            <div>
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                Content (Markdown supported)
              </label>
              <textarea
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="input-luxury resize-none font-mono"
                rows={16}
                placeholder="# Heading&#10;&#10;Write your article here. Markdown is supported.&#10;&#10;## Sub-heading&#10;&#10;Your content..."
                style={{ fontSize: '12px' }}
              />
            </div>

            <div>
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Cover Image URL</label>
              <input
                value={form.coverImage}
                onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                className="input-luxury"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(216,154,24,0.1)' }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
                  className="w-10 h-5 rounded-full relative transition-colors duration-300"
                  style={{ background: form.published ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300"
                    style={{
                      background: 'white',
                      transform: form.published ? 'translateX(21px)' : 'translateX(2px)',
                    }}
                  />
                </div>
                <span className="text-[12px] font-montserrat text-white/60">
                  {form.published ? 'Published' : 'Draft'}
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => { setIsNew(false); setEditing(null) }}
                  className="btn-luxury text-[10px] py-2 px-6"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(240,236,228,0.4)' }}
                >
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-luxury btn-luxury-fill text-[10px] py-2 px-6">
                  {form.published ? 'Publish Post' : 'Save Draft'}
                </button>
              </div>
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
            <h1 className="font-display text-3xl font-light text-white">Blog</h1>
            <p className="text-[12px] font-montserrat text-white/40 mt-1">{posts.length} posts</p>
          </div>
          <button onClick={openNew} className="btn-luxury text-[10px] py-2 px-5 flex items-center gap-2">
            <Plus size={12} /> New Post
          </button>
        </div>

        <div className="admin-card divide-y" style={{ '--tw-divide-color': 'rgba(216,154,24,0.06)' } as any}>
          {posts.map(post => (
            <div key={post._id} className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center text-lg"
                  style={{ background: 'rgba(216,154,24,0.06)', border: '1px solid rgba(216,154,24,0.1)' }}
                >
                  ✦
                </div>
                <div>
                  <p className="text-[14px] font-montserrat text-white">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-montserrat text-gold-400/70">{post.category}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-[10px] font-montserrat text-white/30">{post.createdAt}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-[10px] font-montserrat text-white/30">/blog/{post.slug}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => togglePublish(post._id)}
                  className="text-[9px] font-montserrat tracking-widest uppercase px-3 py-1 transition-all"
                  style={{
                    background: post.published ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                    color: post.published ? '#4ade80' : 'rgba(240,236,228,0.3)',
                    border: `1px solid ${post.published ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {post.published ? 'Published' : 'Draft'}
                </button>
                <button onClick={() => openEdit(post)} className="text-white/30 hover:text-gold-400 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(post._id)} className="text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
