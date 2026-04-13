'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const SHAPES = ['Round Brilliant', 'Princess', 'Cushion', 'Oval', 'Pear', 'Marquise', 'Emerald', 'Radiant', 'Asscher', 'Heart']
const COLORS = ['D', 'E', 'F', 'G']
const CLARITIES = ['VVS1', 'VVS2', 'VS1', 'VS2']
const METALS = ['18ct Yellow Gold', '18ct White Gold', '18ct Rose Gold', '14ct Yellow Gold', '14ct White Gold', '22ct Yellow Gold', 'Platinum']
const RING_SIZES_US = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10']
const RING_SIZES_UK = ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']

// Gold base prices per gram (mock - updated daily)
const GOLD_PRICE_PER_GRAM = { '14ct': 52, '18ct': 67, '22ct': 82, 'Platinum': 45 }
// Diamond price multipliers per carat
const DIAMOND_BASE_PRICE = {
  'D': { VVS1: 8500, VVS2: 7800, VS1: 6800, VS2: 5800 },
  'E': { VVS1: 7500, VVS2: 6800, VS1: 5800, VS2: 5000 },
  'F': { VVS1: 6500, VVS2: 5800, VS1: 4800, VS2: 4000 },
  'G': { VVS1: 5500, VVS2: 4800, VS1: 3800, VS2: 3200 },
}
const CERT_PREMIUM = { IGI: 0, GIA: 0.15 } // GIA 15% premium
const SHAPE_FACTOR = {
  'Round Brilliant': 1.2, 'Princess': 1.0, 'Cushion': 0.95, 'Oval': 1.1,
  'Pear': 1.05, 'Marquise': 1.0, 'Emerald': 0.9, 'Radiant': 0.95, 'Asscher': 0.9, 'Heart': 1.05
}

function estimatePrice(data: any): { diamond: number, setting: number, total: number } {
  const carat = parseFloat(data.carat) || 1
  const basePerCarat = (DIAMOND_BASE_PRICE[data.color]?.[data.clarity] || 5000)
  const certMult = 1 + (CERT_PREMIUM[data.certification] || 0)
  const shapeFactor = SHAPE_FACTOR[data.shape] || 1

  const diamondPrice = carat * basePerCarat * certMult * shapeFactor
  const metalKey = data.metal?.includes('Platinum') ? 'Platinum' : data.metal?.includes('22ct') ? '22ct' : data.metal?.includes('18ct') ? '18ct' : '14ct'
  const settingPrice = (GOLD_PRICE_PER_GRAM[metalKey] || 60) * 8 // ~8g average setting

  return {
    diamond: Math.round(diamondPrice),
    setting: Math.round(settingPrice),
    total: Math.round(diamondPrice + settingPrice),
  }
}

type FormData = {
  carat: string
  shape: string
  color: string
  clarity: string
  certification: 'IGI' | 'GIA'
  metal: string
  ringSize: string
  ringSizeSystem: 'US' | 'UK'
  name: string
  email: string
  phone: string
  country: string
  notes: string
  productType: string
}

export default function DiamondConfigurator() {
  const [step, setStep] = useState(1)
  const [estimate, setEstimate] = useState<{ diamond: number, setting: number, total: number } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [goldPrice, setGoldPrice] = useState({ per_gram_18ct: 67, updated: 'Today' })

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      certification: 'IGI',
      ringSizeSystem: 'US',
      color: 'D',
      clarity: 'VVS1',
      shape: 'Round Brilliant',
      metal: '18ct Yellow Gold',
      carat: '1.00',
      productType: 'Ring',
    }
  })

  const watchedValues = watch()
  const certification = watch('certification')

  useEffect(() => {
    if (watchedValues.carat && watchedValues.color && watchedValues.clarity) {
      setEstimate(estimatePrice(watchedValues))
    }
  }, [watchedValues.carat, watchedValues.color, watchedValues.clarity, watchedValues.certification, watchedValues.shape, watchedValues.metal])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        estimatedPrice: estimate,
        goldPriceToday: goldPrice,
        submittedAt: new Date().toISOString(),
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, payload)
      setShowSuccess(true)
      toast.success('Inquiry submitted! We will contact you within 24 hours.')
    } catch (error) {
      toast.error('Failed to submit. Please try again or contact us directly.')
    }
  }

  const certColor = certification === 'IGI' ? '#38bdf8' : '#22c55e'
  const certBg = certification === 'IGI' ? 'rgba(56,189,248,0.08)' : 'rgba(34,197,94,0.08)'
  const certBorder = certification === 'IGI' ? 'rgba(56,189,248,0.3)' : 'rgba(34,197,94,0.3)'

  return (
    <section id="configurator" className="py-32 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(216,154,24,1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="section-tag">Diamond Configurator</span>
          <h2 className="font-display font-light text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
            Design Your <em className="text-gold-400">Dream Piece</em>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Specify every detail. We craft your vision with precision.
          </p>
        </div>

        {showSuccess ? (
          <div
            className="text-center py-20 border"
            style={{ borderColor: 'rgba(216,154,24,0.2)', background: 'rgba(216,154,24,0.03)' }}
          >
            <div
              className="w-16 h-16 rotate-45 mx-auto mb-8"
              style={{ background: 'linear-gradient(135deg, rgba(216,154,24,0.6), rgba(249,240,204,0.8))', boxShadow: '0 0 30px rgba(216,154,24,0.4)' }}
            />
            <h3 className="font-display text-3xl font-light text-white mb-4">Inquiry Received</h3>
            <p className="section-subtitle mb-2">Thank you for your inquiry.</p>
            <p className="section-subtitle">Our specialist will contact you within <span className="text-gold-400">24 hours</span>.</p>
            <button onClick={() => setShowSuccess(false)} className="btn-luxury mt-10">
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Gold price ticker */}
            <div
              className="flex items-center justify-between px-6 py-3 mb-8 border"
              style={{ borderColor: 'rgba(216,154,24,0.2)', background: 'rgba(216,154,24,0.04)' }}
            >
              <span className="text-[10px] font-montserrat tracking-widest uppercase text-white/40">Live Gold Price</span>
              <span className="text-[13px] font-montserrat font-light text-gold-400">
                18ct: ${goldPrice.per_gram_18ct}/g · Updated {goldPrice.updated}
              </span>
            </div>

            {/* Certification selector */}
            <div className="mb-8">
              <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-3">
                Certification Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['IGI', 'GIA'] as const).map(cert => (
                  <label
                    key={cert}
                    className="relative flex flex-col p-5 border cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: watchedValues.certification === cert
                        ? (cert === 'IGI' ? 'rgba(56,189,248,0.6)' : 'rgba(34,197,94,0.6)')
                        : 'rgba(216,154,24,0.15)',
                      background: watchedValues.certification === cert
                        ? (cert === 'IGI' ? 'rgba(56,189,248,0.06)' : 'rgba(34,197,94,0.06)')
                        : 'transparent',
                    }}
                  >
                    <input type="radio" value={cert} {...register('certification')} className="sr-only" />
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-lg font-montserrat font-light"
                        style={{ color: cert === 'IGI' ? '#38bdf8' : '#22c55e' }}
                      >
                        {cert}
                      </span>
                      {watchedValues.certification === cert && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: cert === 'IGI' ? '#38bdf8' : '#22c55e' }}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-montserrat font-light text-white/50">
                      {cert === 'IGI' ? 'Lab-Grown Diamonds' : 'Natural Diamonds'}
                    </span>
                    {cert === 'GIA' && (
                      <span className="text-[9px] font-montserrat tracking-widest uppercase mt-1" style={{ color: '#22c55e' }}>
                        +15% Premium
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Diamond Specs */}
            <div
              className="p-8 border mb-6"
              style={{ borderColor: certBorder, background: certBg }}
            >
              <h3
                className="text-[10px] font-montserrat tracking-widest uppercase mb-6"
                style={{ color: certColor }}
              >
                Diamond Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carat */}
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                    Carat Weight
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.25"
                    max="10"
                    placeholder="e.g. 1.50"
                    className="input-luxury"
                    {...register('carat', { required: 'Carat is required' })}
                  />
                  {errors.carat && <p className="text-red-400 text-[11px] mt-1">{errors.carat.message}</p>}
                </div>

                {/* Shape */}
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                    Diamond Shape
                  </label>
                  <select className="input-luxury" {...register('shape')}>
                    {SHAPES.map(s => <option key={s} value={s} style={{ background: '#0d0d0d' }}>{s}</option>)}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                    Colour Grade
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map(c => (
                      <label
                        key={c}
                        className="flex items-center justify-center py-3 border cursor-pointer transition-all duration-200 text-[13px] font-montserrat"
                        style={{
                          borderColor: watchedValues.color === c ? certColor : 'rgba(216,154,24,0.2)',
                          color: watchedValues.color === c ? certColor : 'rgba(240,236,228,0.5)',
                          background: watchedValues.color === c ? `${certColor}11` : 'transparent',
                        }}
                      >
                        <input type="radio" value={c} {...register('color')} className="sr-only" />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clarity */}
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">
                    Clarity Grade
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CLARITIES.map(c => (
                      <label
                        key={c}
                        className="flex items-center justify-center py-3 border cursor-pointer transition-all duration-200 text-[11px] font-montserrat"
                        style={{
                          borderColor: watchedValues.clarity === c ? certColor : 'rgba(216,154,24,0.2)',
                          color: watchedValues.clarity === c ? certColor : 'rgba(240,236,228,0.5)',
                          background: watchedValues.clarity === c ? `${certColor}11` : 'transparent',
                        }}
                      >
                        <input type="radio" value={c} {...register('clarity')} className="sr-only" />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metal & Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Metal</label>
                <select className="input-luxury" {...register('metal')}>
                  {METALS.map(m => <option key={m} value={m} style={{ background: '#0d0d0d' }}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Product Type</label>
                <select className="input-luxury" {...register('productType')}>
                  {['Ring', 'Necklace', 'Bracelet', 'Earrings', 'Pendant', 'Bangle', 'Custom'].map(t => (
                    <option key={t} value={t} style={{ background: '#0d0d0d' }}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {watchedValues.productType === 'Ring' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Ring Size System</label>
                  <div className="flex gap-3">
                    {(['US', 'UK'] as const).map(sys => (
                      <label
                        key={sys}
                        className="flex-1 flex items-center justify-center py-3 border cursor-pointer transition-all text-[12px] font-montserrat"
                        style={{
                          borderColor: watchedValues.ringSizeSystem === sys ? 'var(--color-gold)' : 'rgba(216,154,24,0.2)',
                          color: watchedValues.ringSizeSystem === sys ? 'var(--color-gold)' : 'rgba(240,236,228,0.4)',
                        }}
                      >
                        <input type="radio" value={sys} {...register('ringSizeSystem')} className="sr-only" />
                        {sys}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Ring Size</label>
                  <select className="input-luxury" {...register('ringSize')}>
                    <option value="">Select size</option>
                    {(watchedValues.ringSizeSystem === 'US' ? RING_SIZES_US : RING_SIZES_UK).map(s => (
                      <option key={s} value={s} style={{ background: '#0d0d0d' }}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Estimate display */}
            {estimate && (
              <div
                className="p-6 border mb-8"
                style={{ borderColor: 'rgba(216,154,24,0.3)', background: 'rgba(216,154,24,0.04)' }}
              >
                <p className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 mb-4">Estimated Investment</p>
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="flex justify-between gap-16">
                      <span className="text-[12px] font-montserrat text-white/50">Diamond</span>
                      <span className="text-[12px] font-montserrat text-white/70">${estimate.diamond.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-16">
                      <span className="text-[12px] font-montserrat text-white/50">Setting</span>
                      <span className="text-[12px] font-montserrat text-white/70">${estimate.setting.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-px mt-2" style={{ background: 'rgba(216,154,24,0.2)' }} />
                  </div>
                  <div className="text-right ml-8">
                    <p className="text-[9px] font-montserrat tracking-widest uppercase text-white/30">From approx.</p>
                    <p className="font-display text-3xl font-light text-gold-400">${estimate.total.toLocaleString()}</p>
                    <p className="text-[9px] font-montserrat text-white/30 mt-1">Final price on inquiry</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact info */}
            <div
              className="p-8 border mb-8"
              style={{ borderColor: 'rgba(216,154,24,0.15)', background: 'rgba(255,255,255,0.01)' }}
            >
              <h3 className="text-[10px] font-montserrat tracking-widest uppercase text-gold-400 mb-6">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Full Name</label>
                  <input className="input-luxury" placeholder="Your name" {...register('name', { required: 'Name is required' })} />
                  {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Email</label>
                  <input type="email" className="input-luxury" placeholder="your@email.com" {...register('email', { required: 'Email is required' })} />
                  {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Phone (WhatsApp)</label>
                  <input className="input-luxury" placeholder="+1 (555) 000-0000" {...register('phone')} />
                </div>
                <div>
                  <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Country</label>
                  <select className="input-luxury" {...register('country')}>
                    <option value="">Select country</option>
                    {['USA', 'United Kingdom', 'Canada', 'UAE / Dubai', 'Hong Kong', 'India', 'Australia', 'Other'].map(c => (
                      <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-2">Special Requirements</label>
                <textarea
                  className="input-luxury resize-none"
                  rows={3}
                  placeholder="Any additional requirements, engraving, special design requests..."
                  {...register('notes')}
                />
              </div>

              {/* Image upload */}
              <div className="mt-6">
                <label className="text-[10px] font-montserrat tracking-widest uppercase text-white/40 block mb-3">
                  Inspiration Image (Optional)
                </label>
                <label
                  className="flex items-center justify-center gap-3 py-8 border border-dashed cursor-pointer transition-all duration-300 hover:border-gold-500"
                  style={{ borderColor: 'rgba(216,154,24,0.2)' }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <span className="text-2xl text-gold-400/40">+</span>
                  <span className="text-[11px] font-montserrat font-light text-white/30">
                    {imageFile ? imageFile.name : 'Upload inspiration image'}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury w-full justify-center text-[11px] py-5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry — We\'ll Contact You Within 24 Hours'}
            </button>

            <p className="text-center text-[10px] font-montserrat text-white/25 tracking-wider mt-4">
              No payment required · Free consultation · Fully confidential
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
