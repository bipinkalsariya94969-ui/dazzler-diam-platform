'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { email, password })
      localStorage.setItem('admin_token', res.data.token)
      localStorage.setItem('admin_user', JSON.stringify(res.data.user))
      router.push('/admin/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #0d0a05, #050505)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div
            className="w-12 h-12 rotate-45 mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(216,154,24,0.8), rgba(249,240,204,0.9))',
              boxShadow: '0 0 30px rgba(216,154,24,0.3)',
            }}
          />
          <h1 className="font-display text-2xl font-light text-white tracking-widest">DAZZLER DIAM</h1>
          <p className="text-[9px] font-montserrat tracking-[0.4em] uppercase text-gold-400 mt-1">Admin Portal</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="border p-10"
          style={{ borderColor: 'rgba(216,154,24,0.15)', background: 'rgba(255,255,255,0.02)' }}
        >
          <h2 className="font-display text-xl font-light text-white mb-8 text-center">
            Sign In
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-luxury"
                placeholder="admin@dazzlerdiamjewels.com"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-luxury"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-luxury w-full justify-center mt-8 py-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[10px] font-montserrat text-white/20 mt-6 tracking-wider">
          Dazzler Diam Jewels · Authorised Personnel Only
        </p>
      </div>
    </div>
  )
}
