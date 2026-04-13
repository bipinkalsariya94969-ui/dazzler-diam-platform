'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      .fromTo('.hero-title-line', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 }, '-=0.5')
      .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, '-=0.6')
      .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
      .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.3')

    // Floating particles
    const particles = document.querySelectorAll('.hero-particle')
    particles.forEach((p, i) => {
      gsap.to(p, {
        y: -30 - i * 10,
        x: (i % 2 === 0 ? 1 : -1) * 15,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      })
    })
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 60%, #1a1209 0%, #050505 60%)' }}
    >
      {/* Ambient light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/3 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(216,154,24,0.8), transparent)' }}
        />
        <div
          className="absolute top-0 right-1/3 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(216,154,24,0.6), transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(216,154,24,1) 0%, transparent 70%)' }}
        />
      </div>

      {/* Floating diamond particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="hero-particle absolute w-1 h-1 rotate-45"
            style={{
              background: 'rgba(216, 154, 24, 0.6)',
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 4) * 15}%`,
              opacity: 0.3 + i * 0.05,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(216,154,24,1) 1px, transparent 1px), linear-gradient(90deg, rgba(216,154,24,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <span className="hero-tag section-tag opacity-0 inline-block">
          — Est. in Luxury —
        </span>

        <h1 className="font-display font-light leading-none tracking-tight mb-8" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
          <span className="hero-title-line opacity-0 block text-white">DAZZLER</span>
          <span
            className="hero-title-line opacity-0 block italic"
            style={{ color: 'var(--color-gold)', fontSize: '0.85em' }}
          >
            Diam
          </span>
          <span className="hero-title-line opacity-0 block text-white">JEWELS</span>
        </h1>

        <p className="hero-subtitle opacity-0 section-subtitle text-sm tracking-[0.15em] max-w-xl mx-auto mb-12">
          Where diamonds meet destiny. IGI & GIA certified pieces crafted 
          for the extraordinary few.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/configurator" className="hero-cta opacity-0 btn-luxury">
            Configure Diamond
          </Link>
          <Link
            href="/#collections"
            className="hero-cta opacity-0 text-[11px] font-montserrat font-light tracking-[0.2em] uppercase text-white/60 hover:text-gold-400 transition-colors flex items-center gap-2"
          >
            Explore Collection
            <span className="inline-block w-8 h-px" style={{ background: 'currentColor' }} />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[9px] font-montserrat tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div
          className="w-px h-12 relative overflow-hidden"
          style={{ background: 'rgba(216, 154, 24, 0.15)' }}
        >
          <div
            className="absolute top-0 left-0 w-full h-1/2"
            style={{
              background: 'var(--color-gold)',
              animation: 'scrollIndicator 2s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scrollIndicator {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(300%); }
          }
        `}</style>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(transparent, #050505)' }}
      />
    </section>
  )
}
