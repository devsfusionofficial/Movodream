'use client'

import { useEffect, useRef } from 'react'

type PanoramaViewerProps = {
  desktopSrc: string
  mobileSrc: string
  blurSrc: string
  placeholderSrc: string
}

/**
 * Ported from movodream/360.html — a hand-written raw-WebGL equirectangular
 * panorama viewer (inside-out UV sphere, custom shaders, drag-to-look,
 * wheel-to-zoom, idle auto-rotate). No third-party 360° library in the
 * original; none introduced here either.
 *
 * The original ran inside an <iframe>, using postMessage('pano:start'/
 * 'pano:stop') from an IntersectionObserver in the parent page, plus a
 * document.hidden + window.frameElement visibility check inside the
 * iframe itself. Both collapse into one IntersectionObserver + a
 * visibilitychange listener now that this runs directly in the page —
 * strictly simpler, same intent (pause rendering when off-screen or tab
 * hidden).
 */
export function PanoramaViewer({ desktopSrc, mobileSrc, blurSrc, placeholderSrc }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    const MOBILE_BP = 768
    const panoramaUrl = window.innerWidth < MOBILE_BP ? mobileSrc : desktopSrc
    const AUTO_SPEED = 0.03
    const DRAG_SENS = 0.12
    const IDLE_RESUME = 1200
    const DPR = 1
    const isSmallScreen = () => window.innerWidth < MOBILE_BP

    const VS = `
      attribute vec3 aPos;
      attribute vec2 aUV;
      uniform mat4 uProj;
      uniform mat4 uView;
      varying vec2 vUV;
      void main(){
        gl_Position = uProj * uView * vec4(aPos, 1.0);
        vUV = aUV;
      }`

    const FS = `
      precision mediump float;
      varying vec2 vUV;
      uniform sampler2D uTex;
      void main(){ gl_FragColor = texture2D(uTex, vUV); }`

    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const aPos = gl.getAttribLocation(prog, 'aPos')
    const aUV = gl.getAttribLocation(prog, 'aUV')
    const uProj = gl.getUniformLocation(prog, 'uProj')
    const uView = gl.getUniformLocation(prog, 'uView')
    const uTex = gl.getUniformLocation(prog, 'uTex')

    // Sphere geometry (inside-out) — 24×36 bands
    const LAT_BANDS = 24
    const LON_BANDS = 36
    const pos: number[] = []
    const uv: number[] = []
    const idx: number[] = []

    for (let la = 0; la <= LAT_BANDS; la++) {
      const t = (la * Math.PI) / LAT_BANDS
      const st = Math.sin(t)
      const ct = Math.cos(t)
      for (let lo = 0; lo <= LON_BANDS; lo++) {
        const p = (lo * 2 * Math.PI) / LON_BANDS
        pos.push(-Math.cos(p) * st, ct, Math.sin(p) * st)
        uv.push(1 - lo / LON_BANDS, la / LAT_BANDS)
      }
    }
    for (let la = 0; la < LAT_BANDS; la++) {
      for (let lo = 0; lo < LON_BANDS; lo++) {
        const a = la * (LON_BANDS + 1) + lo
        const b = a + LON_BANDS + 1
        idx.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }

    function upload(target: number, data: Float32Array | Uint16Array) {
      const buf = gl!.createBuffer()!
      gl!.bindBuffer(target, buf)
      gl!.bufferData(target, data, gl!.STATIC_DRAW)
      return buf
    }

    const sBufPos = upload(gl.ARRAY_BUFFER, new Float32Array(pos))
    const sBufUV = upload(gl.ARRAY_BUFFER, new Float32Array(uv))
    const sBufIdx = upload(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx))
    const sLen = idx.length

    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([30, 30, 30, 255]))

    function uploadImage(image: HTMLImageElement) {
      gl!.bindTexture(gl!.TEXTURE_2D, tex)
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, image)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
      dirty = true
    }

    const imgBlur = new window.Image()
    imgBlur.onload = () => {
      uploadImage(imgBlur)
      const imgFull = new window.Image()
      imgFull.onload = () => uploadImage(imgFull)
      imgFull.src = panoramaUrl
    }
    imgBlur.src = blurSrc

    function perspective(fov: number, aspect: number, near: number, far: number) {
      const f = 1 / Math.tan(fov / 2)
      const nf = 1 / (near - far)
      // prettier-ignore
      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0,
      ])
    }

    function lookAt(lx: number, ly: number, lz: number) {
      const fl = Math.sqrt(lx * lx + ly * ly + lz * lz)
      const fx = lx / fl
      const fy = ly / fl
      const fz = lz / fl
      let rx = fy * 0 - fz * 1
      let ry = fz * 0 - fx * 0
      let rz = fx * 1 - fy * 0
      const rl = Math.sqrt(rx * rx + ry * ry + rz * rz)
      rx /= rl
      ry /= rl
      rz /= rl
      const ux = ry * fz - rz * fy
      const uy = rz * fx - rx * fz
      const uz = rx * fy - ry * fx
      // prettier-ignore
      return new Float32Array([
        rx, ux, -fx, 0,
        ry, uy, -fy, 0,
        rz, uz, -fz, 0,
        0, 0, 0, 1,
      ])
    }

    let lon = 0
    let lat = 0
    let tLon = 0
    let tLat = 0
    let dragging = false
    let px = 0
    let py = 0
    let fov = (75 * Math.PI) / 180
    const fovMin = (40 * Math.PI) / 180
    const fovMax = (80 * Math.PI) / 180
    let autoOn = !isSmallScreen()
    let lastT = 0
    let dirty = true

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    function markDirty() {
      dirty = true
      lastT = performance.now()
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true
      autoOn = false
      px = e.clientX
      py = e.clientY
      container!.style.cursor = 'grabbing'
      markDirty()
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return
      tLon -= (e.clientX - px) * DRAG_SENS
      tLat += (e.clientY - py) * DRAG_SENS
      tLat = clamp(tLat, -85, 85)
      px = e.clientX
      py = e.clientY
      markDirty()
    }
    function onPointerUp() {
      dragging = false
      container!.style.cursor = 'grab'
      markDirty()
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      fov = clamp(fov + Math.sign(e.deltaY) * 0.05, fovMin, fovMax)
      markDirty()
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    container.addEventListener('wheel', onWheel, { passive: false })

    function resize() {
      const w = Math.round(container!.clientWidth * DPR)
      const h = Math.round(container!.clientHeight * DPR)
      if (canvas!.width === w && canvas!.height === h) return
      canvas!.width = w
      canvas!.height = h
      gl!.viewport(0, 0, w, h)
      if (isSmallScreen()) autoOn = false
      dirty = true
      render()
    }

    let resizeRAF: number | null = null
    function onResize() {
      if (resizeRAF) cancelAnimationFrame(resizeRAF)
      resizeRAF = requestAnimationFrame(() => {
        resizeRAF = null
        resize()
      })
    }
    window.addEventListener('resize', onResize)
    resize()

    function render() {
      if (!isSmallScreen() && !dragging && performance.now() - lastT > IDLE_RESUME) {
        if (!autoOn) autoOn = true
      }
      if (autoOn) {
        tLon += AUTO_SPEED
        dirty = true
      }

      const dlat = tLat - lat
      const dlon = tLon - lon
      if (Math.abs(dlat) > 0.001 || Math.abs(dlon) > 0.001) dirty = true
      lon += dlon * 0.07
      lat += dlat * 0.07

      if (!dirty) return
      dirty = false

      const phi = ((90 - lat) * Math.PI) / 180
      const theta = (lon * Math.PI) / 180
      const lx = Math.sin(phi) * Math.cos(theta)
      const ly = Math.cos(phi)
      const lz = Math.sin(phi) * Math.sin(theta)

      gl!.clearColor(0, 0, 0, 1)
      gl!.clear(gl!.COLOR_BUFFER_BIT)

      gl!.uniformMatrix4fv(uProj, false, perspective(fov, canvas!.width / canvas!.height, 0.1, 2000))
      gl!.uniformMatrix4fv(uView, false, lookAt(lx, ly, lz))
      gl!.uniform1i(uTex, 0)
      gl!.activeTexture(gl!.TEXTURE0)
      gl!.bindTexture(gl!.TEXTURE_2D, tex)

      gl!.bindBuffer(gl!.ARRAY_BUFFER, sBufPos)
      gl!.enableVertexAttribArray(aPos)
      gl!.vertexAttribPointer(aPos, 3, gl!.FLOAT, false, 0, 0)

      gl!.bindBuffer(gl!.ARRAY_BUFFER, sBufUV)
      gl!.enableVertexAttribArray(aUV)
      gl!.vertexAttribPointer(aUV, 2, gl!.FLOAT, false, 0, 0)

      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, sBufIdx)
      gl!.drawElements(gl!.TRIANGLES, sLen, gl!.UNSIGNED_SHORT, 0)
    }

    let rafId: number | null = null
    let lastFrame = 0
    const FRAME_MS = 1000 / 30

    function loop(ts: number) {
      rafId = requestAnimationFrame(loop)
      if (!dirty && autoOn && ts - lastFrame < FRAME_MS) return
      if (!dirty && !autoOn) return
      lastFrame = ts
      render()
    }
    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(loop)
    }
    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    let isVisible = false
    let isPageVisible = !document.hidden

    function syncRunState() {
      if (isVisible && isPageVisible) {
        dirty = true
        startLoop()
      } else {
        stopLoop()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        syncRunState()
      },
      { threshold: 0.1 }
    )
    observer.observe(container)

    function onVisibilityChange() {
      isPageVisible = !document.hidden
      syncRunState()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stopLoop()
      observer.disconnect()
      container!.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      container!.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [desktopSrc, mobileSrc, blurSrc])

  return (
    <div
      ref={containerRef}
      className="bg-frame"
      style={{
        backgroundImage: `url('${placeholderSrc}')`,
        backgroundPosition: 'right',
        backgroundSize: 'cover',
        cursor: 'grab',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
