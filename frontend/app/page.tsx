import HeroSection from '@/components/sections/HeroSection'
import BrandStory from '@/components/sections/BrandStory'
import ProductSpotlight from '@/components/sections/ProductSpotlight'
import CollectionShowcase from '@/components/sections/CollectionShowcase'
import ProductGrid from '@/components/sections/ProductGrid'
import DiamondConfigurator from '@/components/sections/DiamondConfigurator'
import InquiryCTA from '@/components/sections/InquiryCTA'
import BlogSection from '@/components/sections/BlogSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <BrandStory />
      <ProductSpotlight />
      <CollectionShowcase />
      <ProductGrid />
      <DiamondConfigurator />
      <BlogSection />
      <InquiryCTA />
      <Footer />
    </main>
  )
}
