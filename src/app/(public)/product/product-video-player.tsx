'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export function ProductVideoPlayer({
  src,
  poster,
  title,
  priority = false,
}: {
  src: string
  poster: string
  title: string
  priority?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(priority)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // IntersectionObserver to only load and play video when scrolled near/into view
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            const video = videoRef.current
            if (video) {
              video.muted = true
              video.defaultMuted = true
              const p = video.play()
              if (p !== undefined) {
                p.catch(() => {
                  const onInteract = () => {
                    video.play().catch(() => {})
                  }
                  window.addEventListener('scroll', onInteract, { once: true, passive: true })
                  window.addEventListener('click', onInteract, { once: true })
                  window.addEventListener('touchstart', onInteract, { once: true, passive: true })
                })
              }
            }
          } else {
            // Pause off-screen video to save CPU/GPU and memory on mobile & laptop
            const video = videoRef.current
            if (video && !video.paused) {
              video.pause()
            }
          }
        })
      },
      {
        rootMargin: '300px 0px',
        threshold: 0.15,
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#f8eefb]"
    >
      {/* High-quality poster image displayed instantly (0ms perceived load time) */}
      <Image
        src={poster}
        alt={title}
        fill
        sizes="(max-width: 900px) 100vw, 680px"
        priority={priority}
        className={`object-cover transition-opacity duration-700 ease-out ${
          isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Video streams and plays seamlessly as soon as in view */}
      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? 'auto' : 'metadata'}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-label={title}
          onPlaying={() => setIsPlaying(true)}
          onLoadedData={() => setIsLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
