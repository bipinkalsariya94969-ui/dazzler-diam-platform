'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.story-tag', { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, scrollTrigger: { trigger: '.story-tag', start: 'top 85%' } })

      gsap.fromTo('.story-heading', { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.story-heading', start: 'top 80%' } })

      gsap.fromTo('.story-para', { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, scrollTrigger: { trigger: '.story-para', start: 'top 80%' } })

      gsap.fromTo('.story-stat', { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.story-stat', start: 'top 85%' } })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(216,154,24,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: visual */}
        <div className="relative order-2 lg:order-1">
          <div
            className="relative w-full aspect-square max-w-md mx-auto"
          >
            {/* Concentric diamond rings */}
            {[1, 0.75, 0.5, 0.25].map((scale, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rotate-45"
                style={{
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  borderColor: `rgba(216, 154, 24, ${0.08 + i * 0.06})`,
                }}
              />
            ))}
            {/* Center diamond */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rotate-45"
              style={{
                background: 'linear-gradient(135deg, rgba(216,154,24,0.8), rgba(249,240,204,0.9), rgba(216,154,24,0.6))',
                boxShadow: '0 0 60px rgba(216,154,24,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
              }}
            />
            {/* Stats floating */}
            <div
              className="story-stat absolute top-4 right-0 glass p-4 text-center opacity-0"
              style={{ borderColor: 'rgba(216,154,24,0.2)' }}
            >
              <p className="font-display text-3xl font-light text-gold-300">500+</p>
              <p className="text-[10px] font-montserrat tracking-widest uppercase text-white/50 mt-1">Pieces Crafted</p>
            </div>
            <div
              className="story-stat absolute bottom-4 left-0 glass p-4 text-center opacity-0"
              style={{ borderColor: 'rgba(216,154,24,0.2)' }}
            >
              <p className="font-display text-3xl font-light text-gold-300">5</p>
              <p className="text-[10px] font-montserrat tracking-widest uppercase text-white/50 mt-1">Countries</p>
            </div>
          </div>
        </div>

        {/* Right: text */}
        <div className="order-1 lg:order-2">
          <span className="story-tag section-tag opacity-0">Our Legacy</span>

          <h2 className="story-heading font-display font-light text-white mb-8 opacity-0" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: '1.1' }}>
            Diamonds Are Forever.<br />
            <em className="text-gold-400">So Is Our Craft.</em>
          </h2>

          <div className="space-y-5">
            <p className="story-para section-subtitle opacity-0">
              Dazzler Diam Jewels was born from a singular belief: that the finest diamonds deserve the finest craftsmanship. 
              Each piece is a testament to meticulous artistry, sourced with integrity, and certified with precision.
            </p>
            <p className="story-para section-subtitle opacity-0">
              From IGI lab-grown diamonds to GIA natural stones, we serve clients across the USA, UK, Canada, Dubai, 
              and Hong Kong — delivering bespoke pieces that transcend time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { value: 'IGI', label: 'Lab Certified' },
              { value: 'GIA', label: 'Natural Certified' },
              { value: '18ct', label: 'Gold Minimum' },
            ].map((stat) => (
              <div
                key={stat.value}
                className="story-stat opacity-0 text-center py-6 border-t"
                style={{ borderColor: 'rgba(216, 154, 24, 0.2)' }}
              >
                <p className="font-display text-2xl font-light text-gold-400">{stat.value}</p>
                <p className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
