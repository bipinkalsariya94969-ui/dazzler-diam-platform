'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  publishedAt: string
  readTime: string
}

const MOCK_POSTS: BlogPost[] = [
  { _id: '1', title: 'Understanding IGI vs GIA: Which Certification is Right for You?', slug: 'igi-vs-gia', excerpt: 'A deep dive into the two most trusted diamond certification bodies and how they affect your purchase.', coverImage: '', category: 'Education', publishedAt: '2024-12-01', readTime: '5 min' },
  { _id: '2', title: 'The Rise of Lab-Grown Diamonds in Luxury Jewellery', slug: 'lab-grown-luxury', excerpt: 'How lab-grown diamonds are redefining luxury without compromising brilliance or ethics.', coverImage: '', category: 'Trends', publishedAt: '2024-11-15', readTime: '4 min' },
  { _id: '3', title: 'Gold Caratage Guide: 14ct vs 18ct vs 22ct', slug: 'gold-caratage-guide', excerpt: 'Everything you need to know about choosing the right gold purity for your jewellery piece.', coverImage: '', category: 'Guide', publishedAt: '2024-11-01', readTime: '6 min' },
]

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?limit=3`)
      .then(res => { if (res.data?.length) setPosts(res.data) })
      .catch(() => {})
  }, [])

  return (
    <section id="blog" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="section-tag">Journal</span>
            <h2 className="font-display font-light text-white" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
              Diamond <em className="text-gold-400">Insights</em>
            </h2>
          </div>
          <Link href="/blog" className="text-[10px] font-montserrat tracking-widest uppercase text-gold-400 flex items-center gap-2 hover:gap-4 transition-all">
            All Articles <span className="w-8 h-px bg-gold-400 inline-block" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group border transition-all duration-500 hover:border-gold-500"
              style={{ borderColor: 'rgba(216,154,24,0.12)', background: '#080808' }}
            >
              {/* Image placeholder */}
              <div
                className="aspect-video relative overflow-hidden flex items-center justify-center"
                style={{ background: `radial-gradient(ellipse at ${i % 2 === 0 ? '30%' : '70%'} 50%, #1a1209, #050505)` }}
              >
                <div
                  className="w-12 h-12 rotate-45 opacity-30"
                  style={{ background: 'linear-gradient(135deg, rgba(216,154,24,0.6), rgba(249,240,204,0.8))' }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to top, rgba(216,154,24,0.15), transparent)' }}
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[9px] font-montserrat tracking-widest uppercase px-3 py-1 border"
                    style={{ borderColor: 'rgba(216,154,24,0.3)', color: 'var(--color-gold)' }}
                  >
                    {post.category}
                  </span>
                  <span className="text-[10px] font-montserrat text-white/30">{post.readTime} read</span>
                </div>

                <h3 className="font-display text-xl font-light text-white mb-3 leading-snug group-hover:text-gold-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-[12px] font-montserrat font-light text-white/40 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                <div
                  className="mt-5 flex items-center gap-2 text-[10px] font-montserrat tracking-widest uppercase text-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  Read Article <span className="w-6 h-px bg-gold-400 inline-block" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
