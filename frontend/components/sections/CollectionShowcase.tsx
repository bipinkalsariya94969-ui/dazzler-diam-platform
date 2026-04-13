'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const collections = [
  {
    id: 'rings',
    name: 'Rings',
    count: '24 Pieces',
    description: 'From solitaires to eternity bands',
    icon: '◇',
    gradient: 'from-amber-900/30 to-transparent',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    count: '18 Pieces',
    description: 'Tennis chains to pendant drops',
    icon: '◈',
    gradient: 'from-yellow-900/30 to-transparent',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    count: '15 Pieces',
    description: 'Bangles, tennis, and charm styles',
    icon: '◉',
    gradient: 'from-amber-800/20 to-transparent',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    count: '20 Pieces',
    description: 'Studs, drops, and hoops',
    icon: '◎',
    gradient: 'from-yellow-800/20 to-transparent',
  },
]

export default function CollectionShowcase() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.collection-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.collection-grid', start: 'top 80%' }
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="collections" ref={ref} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="section-tag">Our Collections</span>
          <h2 className="font-display font-light text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
            Crafted for Every <em className="text-gold-400">Occasion</em>
          </h2>
        </div>

        <div className="collection-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col) => (
            <Link
              href={`/collections#${col.id}`}
              key={col.id}
              className="collection-card opacity-0 group relative aspect-[3/4] flex flex-col justify-end p-8 overflow-hidden border transition-all duration-500 hover:border-gold-500"
              style={{
                background: '#0a0a0a',
                borderColor: 'rgba(216,154,24,0.15)',
              }}
            >
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.07]"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(216,154,24,1) 0px, rgba(216,154,24,1) 1px, transparent 1px, transparent 20px)`,
                }}
              />

              {/* Top icon */}
              <div
                className="absolute top-8 right-8 text-4xl font-light transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
                style={{ color: 'rgba(216,154,24,0.5)', lineHeight: 1 }}
              >
                {col.icon}
              </div>

              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at bottom, rgba(216,154,24,0.08) 0%, transparent 70%)' }}
              />

              {/* Bottom text */}
              <div className="relative z-10">
                <p className="text-[10px] font-montserrat tracking-[0.25em] uppercase text-gold-400/70 mb-2">{col.count}</p>
                <h3 className="font-display text-3xl font-light text-white mb-2 group-hover:text-gold-300 transition-colors">
                  {col.name}
                </h3>
                <p className="text-[12px] font-montserrat font-light text-white/40">{col.description}</p>

                <div
                  className="mt-5 flex items-center gap-2 text-[10px] font-montserrat tracking-widest uppercase text-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                >
                  Explore
                  <span className="w-6 h-px" style={{ background: 'currentColor' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
