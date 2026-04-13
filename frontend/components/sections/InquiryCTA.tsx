'use client'
import Link from 'next/link'

export default function InquiryCTA() {
  return (
    <section id="inquiry" className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a1209 0%, #050505 65%)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, rgba(216,154,24,1) 0%, transparent 70%)' }}
      />

      {/* Rotating border decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border rotate-45 opacity-10"
        style={{ borderColor: 'rgba(216,154,24,0.5)', animation: 'spin 30s linear infinite' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border rotate-12 opacity-10"
        style={{ borderColor: 'rgba(216,154,24,0.4)', animation: 'spin 20s linear infinite reverse' }}
      />
      <style>{`@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="section-tag">Book Consultation</span>
        <h2
          className="font-display font-light text-white mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
        >
          Your Vision,<br />
          <em className="text-gold-400">Our Mastercraft.</em>
        </h2>

        <p className="section-subtitle mb-12 max-w-lg mx-auto">
          Schedule a private consultation with our diamond specialists. Available via Zoom or WhatsApp — globally.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/configurator" className="btn-luxury btn-luxury-fill px-10 py-5">
            Configure & Inquire
          </Link>
          <a
            href="https://wa.me/your-whatsapp-number"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury px-10 py-5 flex items-center gap-2"
          >
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-16 pt-12 border-t"
          style={{ borderColor: 'rgba(216,154,24,0.1)' }}
        >
          {[
            { icon: '◈', text: 'IGI & GIA Certified' },
            { icon: '◇', text: 'Bespoke Craftsmanship' },
            { icon: '◉', text: 'Worldwide Shipping' },
            { icon: '◎', text: 'Private Consultation' },
          ].map(badge => (
            <div key={badge.text} className="flex items-center gap-2 text-[11px] font-montserrat text-white/40 tracking-wider">
              <span className="text-gold-400/60">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
