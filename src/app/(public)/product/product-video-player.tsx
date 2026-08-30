'use client'

import { useRef, useEffect } from 'react'

export function ProductVideoPlayer({
  src,
  title,
}: {
  src: string
  title: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    const tryPlay = () => {
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

    tryPlay()
  }, [src])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8eefb]">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-label={title}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
