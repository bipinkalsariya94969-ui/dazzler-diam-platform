'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`
      requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      cursor.style.width = '6px'
      cursor.style.height = '6px'
      follower.style.width = '50px'
      follower.style.height = '50px'
      follower.style.borderColor = 'rgba(216, 154, 24, 0.8)'
    }

    const onMouseLeaveLink = () => {
      cursor.style.width = '8px'
      cursor.style.height = '8px'
      follower.style.width = '40px'
      follower.style.height = '40px'
      follower.style.borderColor = 'rgba(216, 154, 24, 0.4)'
    }

    document.addEventListener('mousemove', onMouseMove)
    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink)
      link.addEventListener('mouseleave', onMouseLeaveLink)
    })

    const rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gold-400 pointer-events-none z-[9999] transition-all duration-100"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border pointer-events-none z-[9998] transition-all duration-300"
        style={{
          borderColor: 'rgba(216, 154, 24, 0.4)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
