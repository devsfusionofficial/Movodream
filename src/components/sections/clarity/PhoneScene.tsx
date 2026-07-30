'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Ported from index.html's inline Three.js script (lines 1611–1795). The
 * live site loads three.js r128 + the old non-module GLTFLoader from a CDN
 * global; this uses the modern npm `three` package instead (same stable
 * APIs — Scene/PerspectiveCamera/WebGLRenderer/GLTFLoader/TextureLoader
 * haven't changed shape), which is the upgrade path the architecture doc
 * flagged rather than pinning an old CDN version.
 *
 * Preserved exactly: render is skipped entirely while `.phone-wrap` is out
 * of view (IntersectionObserver), the model itself is only fetched once
 * the section is within 300px of the viewport (a second, earlier
 * IntersectionObserver), and the render loop is dirty-checked frame to
 * frame — it only calls renderer.render() when the lerp is still
 * converging, a scroll just happened, or `.phone-wrap`'s `left` changed.
 */
export function PhoneScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobileViewport,
      powerPreference: 'high-performance',
    })

    let needsRender = true
    let isVisible = true

    function resizeCanvas() {
      const container = canvas!.parentElement
      if (!container) return
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`

      const maxDPR = window.matchMedia('(max-width: 768px)').matches ? 1.5 : 2
      const pixelRatio = Math.min(window.devicePixelRatio || 1, maxDPR)
      renderer.setSize(width * pixelRatio, height * pixelRatio, false)

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      needsRender = true
    }

    let visibilityObserver: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const becameVisible = entry.isIntersecting && !isVisible
            isVisible = entry.isIntersecting
            if (becameVisible) needsRender = true
          })
        },
        { root: null, threshold: 0.01 }
      )
      const phoneWrap = document.querySelector('.phone-wrap')
      if (phoneWrap) visibilityObserver.observe(phoneWrap)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(ambientLight, directionalLight)

    const loader = new GLTFLoader()
    const textureLoader = new THREE.TextureLoader()
    let phoneModelRequested = false
    let animationFrameId: number | null = null

    function startPhoneModelLoad() {
      if (phoneModelRequested) return
      phoneModelRequested = true

      loader.load('/assets/model/iphone16pro.glb', (gltf) => {
        const model = gltf.scene

        textureLoader.load('/assets/model/texture.jpg', (wallpaperTexture) => {
          wallpaperTexture.flipY = false
          wallpaperTexture.colorSpace = THREE.SRGBColorSpace
          wallpaperTexture.wrapS = THREE.ClampToEdgeWrapping
          wallpaperTexture.wrapT = THREE.ClampToEdgeWrapping

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh
              const material = mesh.material as THREE.MeshStandardMaterial
              if (mesh.name === 'main_1' && material) {
                material.map = wallpaperTexture
                material.needsUpdate = true
              }
            }
          })
          needsRender = true
        })

        model.scale.set(13.8, 13.8, 13.8)
        model.position.set(0, -1, 0)
        scene.add(model)
        needsRender = true

        const tilt = { x: 0, y: 0, z: 0 }
        const LERP = 0.06
        const MAX_X = 0.18
        const MAX_Y = 10

        let lastScrollY = window.scrollY
        let scrollDelta = 0
        const handleScroll = () => {
          scrollDelta = window.scrollY - lastScrollY
          lastScrollY = window.scrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })

        function getPhoneLeft() {
          const style = document.querySelector<HTMLElement>('.phone-wrap')?.style.left
          return parseFloat(style ?? '') || 0
        }

        let prevLeft = getPhoneLeft()

        function animate() {
          animationFrameId = requestAnimationFrame(animate)

          const currentLeft = getPhoneLeft()
          const leftDelta = currentLeft - prevLeft
          prevLeft = currentLeft

          const targetY = Math.max(-MAX_Y, Math.min(MAX_Y, leftDelta * 2))
          const targetX = Math.max(-MAX_X, Math.min(MAX_X, scrollDelta * 0.0018))
          const targetZ = -tilt.y * 0.22

          const dx = targetX - tilt.x
          const dy = targetY - tilt.y
          const dz = targetZ - tilt.z
          tilt.x += dx * LERP
          tilt.y += dy * LERP
          tilt.z += dz * LERP

          scrollDelta *= 0.8

          model.rotation.x = tilt.x
          model.rotation.y = tilt.y
          model.rotation.z = tilt.z

          const EPS = 0.0005
          const tiltMoving = Math.abs(dx) > EPS || Math.abs(dy) > EPS || Math.abs(dz) > EPS
          const scrollMoving = Math.abs(scrollDelta) > 0.01
          const positionMoving = Math.abs(leftDelta) > 0.001
          const dirty = needsRender || tiltMoving || scrollMoving || positionMoving

          if (isVisible && dirty) {
            renderer.render(scene, camera)
            needsRender = false
          }
        }
        if (isVisible) animate()

        cleanupFns.push(() => window.removeEventListener('scroll', handleScroll))
      })
    }

    const cleanupFns: Array<() => void> = []

    const phoneLoadTarget = document.querySelector('.section-3')
    let preloadObserver: IntersectionObserver | null = null
    if ('IntersectionObserver' in window && phoneLoadTarget) {
      preloadObserver = new IntersectionObserver(
        (entries, observer) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startPhoneModelLoad()
            observer.disconnect()
          }
        },
        { root: null, rootMargin: '300px 0px', threshold: 0.01 }
      )
      preloadObserver.observe(phoneLoadTarget)
    } else {
      startPhoneModelLoad()
    }

    camera.position.z = 2

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      visibilityObserver?.disconnect()
      preloadObserver?.disconnect()
      cleanupFns.forEach((fn) => fn())
      renderer.dispose()
    }
  }, [])

  // Ported from script.js lines 2049–2083: once section-3 scrolls past,
  // the same canvas keeps drifting (sine/cosine x/y/rotation/scale) through
  // the following sections' scroll range, matching the original's
  // "FLOATING 3D PHONE" effect. Separate effect from the Three.js setup
  // above since it's a plain DOM/GSAP concern, not a WebGL one.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    gsap.registerPlugin(ScrollTrigger)
    gsap.set(canvas, { position: 'relative', zIndex: 'auto' })

    let lastP = -1
    const trigger = ScrollTrigger.create({
      trigger: '.section-3',
      scroller: document.body,
      start: 'bottom top',
      end: '+=300%',
      scrub: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        canvas.classList.add('floating-phone')
      },
      onUpdate: (self) => {
        const p = Math.round(self.progress * 200) / 200
        if (p === lastP) return
        lastP = p
        gsap.set(canvas, {
          x: 60 * Math.sin(p * Math.PI * 3),
          y: 40 * Math.cos(p * Math.PI * 2.5),
          rotation: 15 * Math.sin(p * Math.PI * 1.5),
          scale: 0.75 + 0.25 * Math.sin(p * Math.PI * 4),
        })
      },
      onLeaveBack: () => {
        canvas.classList.remove('floating-phone')
        gsap.set(canvas, { x: 0, y: 0, rotation: 0, scale: 1 })
      },
    })

    return () => trigger.kill()
  }, [])

  return <canvas id="phone-3d-canvas" ref={canvasRef} />
}
