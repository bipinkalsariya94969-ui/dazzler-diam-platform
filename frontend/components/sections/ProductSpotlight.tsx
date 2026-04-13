'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const spotlightProducts = [
  {
    id: 1,
    name: 'The Eternal Solitaire',
    category: 'Engagement Ring',
    description: 'A 3-carat round brilliant diamond, D-color, VVS1 clarity, set in 18ct platinum. Certified by GIA.',
    certification: 'GIA',
    diamond: '3.00ct Round Brilliant',
    color: 'D',
    metal: '18ct Platinum',
    accent: '#22c55e',
  },
  {
    id: 2,
    name: 'Celestial Cascade',
    category: 'Diamond Necklace',
    description: 'Eighteen princess-cut lab-grown diamonds cascading in 18ct rose gold. IGI certified, F-color, VS1.',
    certification: 'IGI',
    diamond: '2.40ct Total Weight',
    color: 'F',
    metal: '18ct Rose Gold',
    accent: '#38bdf8',
  },
  {
    id: 3,
    name: 'Royal Pavé Band',
    category: 'Wedding Band',
    description: 'Forty-eight micro-pavé set round diamonds encircling a band of 18ct yellow gold. IGI certified.',
    certification: 'IGI',
    diamond: '1.20ct Total Weight',
    color: 'G',
    metal: '18ct Yellow Gold',
    accent: '#38bdf8',
  },
]

export default function ProductSpotlight() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      spotlightProducts.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.spotlight-panel-${i}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, #150f05 0%, #050505 60%)' }} />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual diamond */}
          <div className="relative flex items-center justify-center h-80">
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${spotlightProducts[active].accent}33, transparent 70%)`, transition: 'background 0.8s ease' }}
            />
            {/* Diamond geometry */}
            <div className="relative w-48 h-48" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <div
                className="absolute inset-0 rotate-45 border-2"
                style={{ borderColor: spotlightProducts[active].accent, opacity: 0.6, transition: 'border-color 0.8s ease' }}
              />
              <div
                className="absolute inset-4 rotate-45 border"
                style={{ borderColor: spotlightProducts[active].accent, opacity: 0.4, transition: 'border-color 0.8s ease' }}
              />
              <div
                className="absolute inset-8 rotate-45"
                style={{
                  background: `linear-gradient(135deg, ${spotlightProducts[active].accent}44, rgba(249,240,204,0.8), ${spotlightProducts[active].accent}44)`,
                  boxShadow: `0 0 40px ${spotlightProducts[active].accent}66`,
                  transition: 'all 0.8s ease',
                }}
              />
            </div>

            {/* Cert badge */}
            <div
              className="absolute bottom-8 right-8 px-4 py-2 border text-[10px] font-montserrat tracking-widest uppercase"
              style={{
                borderColor: spotlightProducts[active].accent,
                color: spotlightProducts[active].accent,
                background: `${spotlightProducts[active].accent}11`,
                transition: 'all 0.5s ease',
              }}
            >
              {spotlightProducts[active].certification} Certified
            </div>
          </div>

          {/* Right: Info */}
          <div key={active} style={{ animation: 'fadeUp 0.6s ease forwards' }}>
            <span className="section-tag">{spotlightProducts[active].category}</span>
            <h2 className="font-display font-light text-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {spotlightProducts[active].name}
            </h2>
            <p className="section-subtitle mb-8">{spotlightProducts[active].description}</p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Diamond', value: spotlightProducts[active].diamond },
                { label: 'Colour', value: spotlightProducts[active].color },
                { label: 'Metal', value: spotlightProducts[active].metal },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="py-4 border-t"
                  style={{ borderColor: 'rgba(216,154,24,0.2)' }}
                >
                  <p className="text-[9px] font-montserrat tracking-widest uppercase text-white/30 mb-1">{spec.label}</p>
                  <p className="text-[13px] font-montserrat font-light text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            <Link href="/configurator" className="btn-luxury pointer-events-auto">
              Inquire About This Piece
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll panels */}
      {spotlightProducts.map((_, i) => (
        <div key={i} className={`spotlight-panel-${i} h-screen`} style={{ zIndex: 0 }} />
      ))}
    </section>
  )
}
