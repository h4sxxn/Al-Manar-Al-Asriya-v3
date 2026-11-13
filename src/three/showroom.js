import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { reducedMotion } from '../fx/scroll'

/* The luxury showroom stage: the real JCB 3CX on a slowly rotating circular
   platform under a ring of spotlights, on a dark glossy floor. The turntable
   spins on its own, answers to a dragging finger with damped inertia, and
   takes extra rotation from the scroll choreography while the camera dollies. */
export function makeShowroom(mount, { fov = 36 } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(mount.clientWidth, mount.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  renderer.domElement.className = 'webgl'
  mount.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0b0906, 20, 44)
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.38

  const camera = new THREE.PerspectiveCamera(fov, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 120)
  const camState = { dist: 12.4, height: 3.1, targetDist: 12.4, targetHeight: 3.1 }
  const camTarget = new THREE.Vector3(0, 1.05, 0)

  /* ————— light ————— */
  scene.add(new THREE.HemisphereLight(0xffe2b8, 0x191008, 0.45))
  const key = new THREE.SpotLight(0xffdca6, 900, 60, 0.62, 0.55, 1.6)
  key.position.set(5.5, 11, 4.5)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.bias = -0.0004
  key.shadow.radius = 6
  scene.add(key)
  key.target.position.set(0, 0.8, 0); scene.add(key.target)
  const rimSpot = new THREE.SpotLight(0xc9974f, 650, 60, 0.7, 0.7, 1.7)
  rimSpot.position.set(-8, 8.5, -6.5)
  scene.add(rimSpot)
  rimSpot.target.position.set(0, 1, 0); scene.add(rimSpot.target)
  const fill = new THREE.PointLight(0xffb35c, 60, 30, 1.8)
  fill.position.set(0, 3.2, 7.5)
  scene.add(fill)

  /* ————— floor: dark gloss + a pool of warm light ————— */
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(30, 64),
    new THREE.MeshStandardMaterial({ color: 0x0d0a07, roughness: 0.38, metalness: 0.72, envMapIntensity: 0.5 })
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const poolTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255,196,110,0.42)')
    grad.addColorStop(0.55, 'rgba(214,150,70,0.14)')
    grad.addColorStop(1, 'rgba(214,150,70,0)')
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  })()
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(5.6, 48),
    new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  pool.rotation.x = -Math.PI / 2
  pool.position.y = 0.006
  scene.add(pool)

  /* ————— spotlight ring ————— */
  const ringGroup = new THREE.Group()
  ringGroup.position.y = 6.9
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x2a2015, roughness: 0.4, metalness: 0.6, emissive: 0xffc478, emissiveIntensity: 0.9 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.35, 0.055, 12, 96), ringMat)
  ring.rotation.x = Math.PI / 2
  ringGroup.add(ring)
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff0cd, emissive: 0xffdf9e, emissiveIntensity: 3.2 })
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), bulbMat)
    b.position.set(Math.cos(a) * 4.35, -0.05, Math.sin(a) * 4.35)
    ringGroup.add(b)
  }
  scene.add(ringGroup)

  // fake volumetric cones from four ring points down to the platform
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0xffc98a, transparent: true, opacity: 0.03,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false,
  })
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4
    const top = new THREE.Vector3(Math.cos(a) * 4.35, 6.85, Math.sin(a) * 4.35)
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.7, 6.9, 20, 1, true), coneMat)
    cone.position.copy(top).lerp(new THREE.Vector3(0, 0, 0), 0.5)
    cone.lookAt(0, 0, 0)
    cone.rotateX(Math.PI / 2)
    scene.add(cone)
  }

  /* ————— turntable: platform + machine ride together ————— */
  const turntable = new THREE.Group()
  scene.add(turntable)
  const platMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1510, roughness: 0.24, metalness: 0.55, clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 0.75 })
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(3.85, 4.0, 0.24, 72), platMat)
  platform.position.y = 0.12
  platform.receiveShadow = true
  turntable.add(platform)
  const edge = new THREE.Mesh(
    new THREE.TorusGeometry(3.86, 0.028, 10, 96),
    new THREE.MeshStandardMaterial({ color: 0x8a5f27, emissive: 0xd9973f, emissiveIntensity: 1.5, roughness: 0.35, metalness: 0.6 })
  )
  edge.rotation.x = Math.PI / 2
  edge.position.y = 0.245
  turntable.add(edge)
  const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(3.8, 48), new THREE.ShadowMaterial({ opacity: 0.42 }))
  shadowCatcher.rotation.x = -Math.PI / 2
  shadowCatcher.position.y = 0.247
  shadowCatcher.receiveShadow = true
  turntable.add(shadowCatcher)

  /* ————— turntable control: idle spin, drag with inertia ————— */
  const spin = { vel: 0, extra: 0, dragging: false, lastX: 0, idleFor: 0 }
  const IDLE_SPEED = 0.14 // rad/s — a slow, luxurious rotation
  const el = renderer.domElement
  el.style.cursor = 'grab'
  const onDown = (e) => {
    spin.dragging = true; spin.lastX = e.clientX; spin.vel = 0; spin.idleFor = 0
    el.style.cursor = 'grabbing'
    el.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (!spin.dragging) return
    const dx = e.clientX - spin.lastX
    spin.lastX = e.clientX
    const d = dx * 0.008
    turntable.rotation.y += d
    spin.vel = d * 60
    spin.idleFor = 0
  }
  const onUp = () => { spin.dragging = false; el.style.cursor = 'grab' }
  el.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)

  let paused = false, raf = 0, ema = 16, frames = 0, elapsed = 0
  const tickers = []
  const clock = new THREE.Clock()
  function loop() {
    raf = requestAnimationFrame(loop)
    if (paused || document.hidden) return
    const rawDt = clock.getDelta()
    const dt = Math.min(rawDt, 0.05)
    // the turntable runs on wall-clock time (generous clamp), so the spin
    // stays honest even when a weak GPU renders at very low frame rates
    const spinDt = Math.min(rawDt, 0.5)
    elapsed += dt
    if (!spin.dragging) {
      spin.idleFor += spinDt
      if (Math.abs(spin.vel) > 0.002) {
        turntable.rotation.y += spin.vel * spinDt
        spin.vel *= Math.pow(0.12, spinDt) // inertia decay
      } else if (!reducedMotion() && spin.idleFor > 1.6) {
        turntable.rotation.y += IDLE_SPEED * spinDt
      }
    }
    turntable.rotation.y += spin.extra * spinDt
    camState.dist += (camState.targetDist - camState.dist) * Math.min(1, dt * 3.2)
    camState.height += (camState.targetHeight - camState.height) * Math.min(1, dt * 3.2)
    const az = 0.65 + Math.sin(elapsed * 0.07) * 0.05 // near-still camera, a breath of drift
    camera.position.set(Math.sin(az) * camState.dist, camState.height, Math.cos(az) * camState.dist)
    camera.lookAt(camTarget)
    ringGroup.rotation.y -= dt * 0.02
    for (const fn of tickers) fn(dt)
    renderer.render(scene, camera)
    ema = ema * 0.95 + dt * 1000 * 0.05
    if (++frames % 100 === 0 && ema > 25 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25)
      renderer.setPixelRatio(dpr)
    }
  }
  loop()

  const io = new IntersectionObserver(([e]) => { paused = !e.isIntersecting }, { threshold: 0.02 })
  io.observe(mount)
  function onResize() {
    const w = mount.clientWidth, h = mount.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(mount)

  return {
    renderer, scene, camera, turntable,
    onTick: (fn) => tickers.push(fn),
    rotation: () => turntable.rotation.y,
    nudge: (rad) => { turntable.rotation.y += rad },
    setSpinExtra: (v) => { spin.extra = v },
    setCamera: (dist, height) => { camState.targetDist = dist; if (height) camState.targetHeight = height },
    cameraDist: () => camState.dist,
    snapCamera: (dist, height) => { camState.dist = dist; camState.targetDist = dist; if (height) { camState.height = height; camState.targetHeight = height } },
    dispose() {
      cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      renderer.dispose()
      pmrem.dispose()
      mount.removeChild(renderer.domElement)
    },
  }
}
