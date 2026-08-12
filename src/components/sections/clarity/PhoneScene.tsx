'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * Ported from index.html's inline Three.js script (lines 1611–1795). The
 * live site loads three.js r128 + the old non-module GLTFLoader from a CDN
 * global; this uses the modern npm `three` package instead (same stable
 * APIs — Scene/PerspectiveCamera/WebGLRenderer/GLTFLoader/TextureLoader
 * haven't changed shape), which is the upgrade path the architecture doc
 * flagged rather than pinning an old CDN version.
 *
 * Preserved: render is skipped entirely while `.phone-wrap` is out of view
 * (IntersectionObserver), the model itself is only fetched once the section
 * is within 300px of the viewport (a second, earlier IntersectionObserver),
 * and the render loop is dirty-checked frame to frame — it only calls
 * renderer.render() when the lerp is still converging or a scroll just
 * happened.
 *
 * NOT ported: the live site flies `.phone-wrap` (position: fixed) across
 * the entire page via a separate ~120-line GSAP sequence spanning Vision →
 * Advantage → Ecosystem → footer, and this model's Y-axis rotation was
 * originally driven by that horizontal drift. That whole sequence is a
 * separate task. Here the phone instead gets its own self-contained
 * scroll-reactive spin (tied to scroll progress through just the Vision
 * section) so it isn't static — not full parity with the live site.
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
      // The container can still be 0x0 at mount (not yet laid out — timing
      // depends on hydration/font-load races, which is why the phone only
      // failed to appear intermittently rather than every time). Skip
      // sizing off a zero dimension — it'd set camera.aspect to NaN/Infinity
      // and the renderer to 0x0, and since nothing but window 'resize' used
      // to re-run this, that broken state stuck around for the whole
      // session. The ResizeObserver below re-fires as soon as the container
      // actually gets real dimensions.
      if (width === 0 || height === 0) return

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
    // Catches the container going from 0x0 to its real size (and any later
    // layout shift), which a one-shot measurement + window-resize-only
    // listener can miss entirely if that transition happens between them.
    let resizeObserver: ResizeObserver | null = null
    if (canvas.parentElement && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => resizeCanvas())
      resizeObserver.observe(canvas.parentElement)
    }

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
        const mouseTilt = { x: 0, y: 0 }
        const LERP = 0.06
        const MAX_X = 0.18

        let lastScrollY = window.scrollY
        let scrollDelta = 0
        const handleScroll = () => {
          scrollDelta = window.scrollY - lastScrollY
          lastScrollY = window.scrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })

        const s3Left = document.querySelector<HTMLElement>('.s3-left')
        const handleMouseMove = (e: MouseEvent) => {
          if (!s3Left) return
          const rect = s3Left.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          mouseTilt.x = ((e.clientX - cx) / (rect.width / 2)) * 0.25
          mouseTilt.y = ((e.clientY - cy) / (rect.height / 2)) * 0.2
        }
        const handleMouseLeave = () => {
          mouseTilt.x = 0
          mouseTilt.y = 0
        }
        if (s3Left) {
          s3Left.addEventListener('mousemove', handleMouseMove)
          s3Left.addEventListener('mouseleave', handleMouseLeave)
        }

        const visionSection = document.querySelector<HTMLElement>('.section-3')
        function getVisionScrollProgress() {
          if (!visionSection) return 0.5
          const rect = visionSection.getBoundingClientRect()
          const total = window.innerHeight + rect.height
          if (total <= 0) return 0.5
          const raw = (window.innerHeight - rect.top) / total
          return Math.max(0, Math.min(1, raw))
        }

        function animate() {
          animationFrameId = requestAnimationFrame(animate)

          const progress = getVisionScrollProgress()
          // Smooth front-facing scroll sweep (-0.35 rad to +0.35 rad, centered at 0 when progress=0.5)
          const scrollYRotation = (progress - 0.5) * 0.7
          const targetY = scrollYRotation + mouseTilt.x
          const targetX = Math.max(-MAX_X, Math.min(MAX_X, scrollDelta * 0.0018)) - mouseTilt.y
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
          const dirty = needsRender || tiltMoving || scrollMoving

          if (dirty) {
            renderer.render(scene, camera)
            needsRender = false
          }
        }
        animate()

        cleanupFns.push(() => {
          window.removeEventListener('scroll', handleScroll)
          if (s3Left) {
            s3Left.removeEventListener('mousemove', handleMouseMove)
            s3Left.removeEventListener('mouseleave', handleMouseLeave)
          }
        })
      })
    }

    const cleanupFns: Array<() => void> = []

    // Start loading the model immediately on mount
    startPhoneModelLoad()

    camera.position.z = 2

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      cleanupFns.forEach((fn) => fn())
      renderer.dispose()
    }
  }, [])

  return <canvas id="phone-3d-canvas" ref={canvasRef} />
}
