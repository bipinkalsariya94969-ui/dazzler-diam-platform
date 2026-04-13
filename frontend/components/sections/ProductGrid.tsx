'use client'
import { useState } from 'react'
import Link from 'next/link'

const products = [
  { id: 1, name: 'Eclipse Solitaire', category: 'Rings', cert: 'GIA', carat: '2.00ct', color: 'D', clarity: 'VVS1' },
  { id: 2, name: 'Lumière Pendant', category: 'Necklaces', cert: 'IGI', carat: '1.50ct', color: 'E', clarity: 'VVS2' },
  { id: 3, name: 'Aurora Studs', category: 'Earrings', cert: 'IGI', carat: '1.00ct', color: 'F', clarity: 'VS1' },
  { id: 4, name: 'Celestial Band', category: 'Rings', cert: 'GIA', carat: '1.80ct', color: 'D', clarity: 'VVS1' },
  { id: 5, name: 'Cascade Tennis', category: 'Bracelets', cert: 'IGI', carat: '5.00ct', color: 'G', clarity: 'VS2' },
  { id: 6, name: 'Nova Drop', category: 'Earrings', cert: 'GIA', carat: '0.80ct', color: 'E', clarity: 'VVS2' },
]

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets']

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="section-tag">Featured Pieces</span>
            <h2 className="font-display font-light text-white" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
              Signature <em className="text-gold-400">Designs</em>
            </h2>
          </div>

          <div className="flex gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 text-[10px] font-montserrat tracking-widest uppercase transition-all duration-300"
                style={{
                  background: activeCategory === cat ? 'var(--color-gold)' : 'transparent',
                  color: activeCategory === cat ? '#050505' : 'rgba(240,236,228,0.4)',
                  border: `1px solid ${activeCategory === cat ? 'var(--color-gold)' : 'rgba(216,154,24,0.2)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group border transition-all duration-500 hover:border-gold-500"
              style={{
                background: '#080808',
                borderColor: 'rgba(216,154,24,0.12)',
              }}
            >
              {/* Product visual placeholder */}
              <div
                className="relative aspect-square flex items-center justify-center overflow-hidden"
                style={{ background: 'radial-gradient(circle at center, #150f05, #050505)' }}
              >
                {/* Diamond shape */}
                <div
                  className="w-24 h-24 rotate-45 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(216,154,24,0.4), rgba(249,240,204,0.7), rgba(216,154,24,0.3))',
                    boxShadow: '0 0 30px rgba(216,154,24,0.3)',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at center, rgba(216,154,24,0.08), transparent 70%)' }}
                />

                {/* Cert badge */}
                <div
                  className="absolute top-4 left-4 px-3 py-1 text-[9px] font-montserrat tracking-widest uppercase"
                  style={{
                    background: product.cert === 'GIA' ? 'rgba(34,197,94,0.1)' : 'rgba(56,189,248,0.1)',
                    border: `1px solid ${product.cert === 'GIA' ? 'rgba(34,197,94,0.4)' : 'rgba(56,189,248,0.4)'}`,
                    color: product.cert === 'GIA' ? '#22c55e' : '#38bdf8',
                  }}
                >
                  {product.cert}
                </div>

                {/* Inquire overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(5,5,5,0.7)' }}
                >
                  <Link href="/configurator" className="btn-luxury text-[10px] py-3 px-6">
                    Inquire
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <p className="text-[9px] font-montserrat tracking-widest uppercase text-white/30 mb-1">{product.category}</p>
                <h3 className="font-display text-xl font-light text-white mb-4 group-hover:text-gold-300 transition-colors">
                  {product.name}
                </h3>
                <div className="flex gap-4">
                  {[
                    { label: 'Carat', value: product.carat },
                    { label: 'Color', value: product.color },
                    { label: 'Clarity', value: product.clarity },
                  ].map(spec => (
                    <div key={spec.label}>
                      <p className="text-[8px] font-montserrat tracking-widest uppercase text-white/25">{spec.label}</p>
                      <p className="text-[12px] font-montserrat font-light text-white/70">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/collections" className="btn-luxury">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  )
}
