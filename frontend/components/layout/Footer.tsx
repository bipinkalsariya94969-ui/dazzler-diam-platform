import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#030303', borderTop: '1px solid rgba(216, 154, 24, 0.1)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(216,154,24,0.6), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <h2 className="font-display text-3xl font-light tracking-widest text-white">DAZZLER DIAM</h2>
              <p className="text-[9px] font-montserrat tracking-[0.4em] uppercase mt-1" style={{ color: 'var(--color-gold)' }}>
                Jewels
              </p>
            </div>
            <p className="section-subtitle text-[12px] max-w-sm mb-8">
              Exquisite lab-grown and natural diamond jewellery, crafted for the discerning. 
              IGI & GIA certified. Ships to USA, UK, Canada, Dubai & Hong Kong.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/dazzler_dja"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border flex items-center justify-center transition-colors hover:border-gold-500"
                style={{ borderColor: 'rgba(216, 154, 24, 0.3)' }}
              >
                <Instagram size={15} className="text-gold-400" />
              </a>
              <a
                href="https://pin.it/6nzITgG0o"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border flex items-center justify-center transition-colors hover:border-gold-500 text-gold-400"
                style={{ borderColor: 'rgba(216, 154, 24, 0.3)', fontSize: '13px', fontFamily: 'serif' }}
              >
                P
              </a>
              <a
                href="https://youtube.com/@dazzlerdja"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border flex items-center justify-center transition-colors hover:border-gold-500 text-gold-400"
                style={{ borderColor: 'rgba(216, 154, 24, 0.3)', fontSize: '12px', fontFamily: 'var(--font-montserrat)' }}
              >
                ▶
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-[10px] font-montserrat font-medium tracking-[0.3em] uppercase mb-6 text-gold-400">
              Collections
            </h3>
            <ul className="space-y-3">
              {['Engagement Rings', 'Wedding Bands', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'].map(item => (
                <li key={item}>
                  <Link
                    href="/collections"
                    className="text-[12px] font-montserrat font-light tracking-wide text-white/50 hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[10px] font-montserrat font-medium tracking-[0.3em] uppercase mb-6 text-gold-400">
              Services
            </h3>
            <ul className="space-y-3">
              {['Diamond Configurator', 'Bespoke Design', 'IGI Certification', 'GIA Certification', 'Book Appointment', 'Track Order'].map(item => (
                <li key={item}>
                  <Link
                    href="/configurator"
                    className="text-[12px] font-montserrat font-light tracking-wide text-white/50 hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-gold mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-montserrat font-light tracking-[0.15em] text-white/30">
            © {new Date().getFullYear()} Dazzler Diam Jewels. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map(item => (
              <Link
                key={item}
                href="#"
                className="text-[10px] font-montserrat font-light tracking-wider text-white/30 hover:text-gold-400 transition-colors uppercase"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
