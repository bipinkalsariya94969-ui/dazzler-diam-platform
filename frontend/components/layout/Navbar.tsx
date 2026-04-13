'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Collections', href: '/#collections' },
  { label: 'Configure', href: '/configurator' },
  { label: 'Our Story', href: '/#story' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#inquiry' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5, 5, 5, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(216, 154, 24, 0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start">
          <span className="font-display text-xl font-light tracking-[0.15em] text-white leading-none">
            DAZZLER DIAM
          </span>
          <span
            className="text-[9px] font-montserrat font-light tracking-[0.4em] uppercase mt-0.5"
            style={{ color: 'var(--color-gold)' }}
          >
            Jewels
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] font-montserrat font-light tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold-400"
              style={{ color: 'rgba(240, 236, 228, 0.7)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/configurator"
            className="btn-luxury text-[10px] py-3 px-6"
          >
            Design Yours
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(5, 5, 5, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(216, 154, 24, 0.1)',
          }}
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] font-montserrat font-light tracking-[0.25em] uppercase text-white/70 hover:text-gold-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/configurator"
              className="btn-luxury text-[10px] py-3 text-center mt-4"
              onClick={() => setMenuOpen(false)}
            >
              Design Yours
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
