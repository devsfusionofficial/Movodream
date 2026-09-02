'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

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
    let isVisible = false

    function resizeCanvas() {
      const container = canvas!.parentElement
      if (!container) return
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      if (width === 0 || height === 0) return

      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`

      const pixelRatio = isMobileViewport ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      renderer.setSize(width * pixelRatio, height * pixelRatio, false)

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      needsRender = true
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(ambientLight, directionalLight)

    const loader = new GLTFLoader()
    const textureLoader = new THREE.TextureLoader()
    let phoneModelRequested = false
    let animationFrameId: number | null = null
    let firstFrameRendered = false
    const cleanupFns: Array<() => void> = []

    function startPhoneModelLoad() {
      if (phoneModelRequested) return
      phoneModelRequested = true

      let loadedGltf: any = null
      let loadedTexture: THREE.Texture | null = null

      function tryAssembleModel() {
        if (!loadedGltf || !loadedTexture) return

        const model = loadedGltf.scene

        model.traverse((child: any) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            const material = mesh.material as THREE.MeshStandardMaterial
            if (mesh.name === 'main_1' && material) {
              material.map = loadedTexture
              material.needsUpdate = true
            }
          }
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

          // Throttle completely when offscreen to save mobile CPU/GPU
          if (!isVisible) return

          const progress = getVisionScrollProgress()
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

            if (!firstFrameRendered) {
              firstFrameRendered = true
              canvas?.classList.add('is-ready')
              canvas?.parentElement?.classList.add('has-3d')
            }
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
      }

      // Concurrently fetch 3D model and wallpaper texture to eliminate sequential waterfall
      loader.load(
        '/assets/model/iphone16pro.glb',
        (gltf) => {
          loadedGltf = gltf
          tryAssembleModel()
        },
        undefined,
        (err) => console.error('Failed to load phone 3D model:', err)
      )

      textureLoader.load(
        '/assets/model/texture.jpg',
        (wallpaperTexture) => {
          wallpaperTexture.flipY = false
          wallpaperTexture.colorSpace = THREE.SRGBColorSpace
          wallpaperTexture.wrapS = THREE.ClampToEdgeWrapping
          wallpaperTexture.wrapT = THREE.ClampToEdgeWrapping
          loadedTexture = wallpaperTexture
          tryAssembleModel()
        },
        undefined,
        (err) => console.error('Failed to load phone texture:', err)
      )
    }

    let visibilityObserver: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const becameVisible = entry.isIntersecting
            isVisible = entry.isIntersecting
            if (becameVisible) {
              needsRender = true
              startPhoneModelLoad()
            }
          })
        },
        { root: null, rootMargin: '800px', threshold: 0.01 }
      )
      const phoneWrap = document.querySelector('.phone-wrap')
      if (phoneWrap) visibilityObserver.observe(phoneWrap)
    }

    // Proactively prefetch during browser idle time so model is ready before user scrolls to vision
    const idleId = typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(() => startPhoneModelLoad(), { timeout: 2000 })
      : setTimeout(() => startPhoneModelLoad(), 1500)

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    let resizeObserver: ResizeObserver | null = null
    if (canvas.parentElement && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => resizeCanvas())
      resizeObserver.observe(canvas.parentElement)
    }

    camera.position.z = 2

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && typeof idleId === 'number') {
        (window as any).cancelIdleCallback(idleId)
      } else {
        clearTimeout(idleId)
      }
      cleanupFns.forEach((fn) => fn())
      renderer.dispose()
    }
  }, [])

  return <canvas id="phone-3d-canvas" ref={canvasRef} />
}
