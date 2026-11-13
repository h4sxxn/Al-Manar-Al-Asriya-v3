import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { reducedMotion } from '../fx/scroll'

/* Shared WebGL stage: light studio environment, soft shadows, polar HUD grid,
   damped orbit controls, adaptive DPR, pause when off-screen or tab hidden. */
export function makeStage(mount, { fov = 38, camPos = [8, 3.2, 8], target = [0, 1, 0], grid = true, dark = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(mount.clientWidth, mount.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.02
  renderer.domElement.className = 'webgl'
  mount.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = dark ? 0.32 : 0.5

  const camera = new THREE.PerspectiveCamera(fov, mount.clientWidth / mount.clientHeight, 0.1, 120)
  camera.position.set(...camPos)

  const hemi = new THREE.HemisphereLight(dark ? 0xffe2b8 : 0xffffff, dark ? 0x191008 : 0xd8dcd2, dark ? 0.5 : 0.85)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(dark ? 0xffd9a8 : 0xffffff, dark ? 2.1 : 2.4)
  sun.position.set(6, 10, 4)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -7; sun.shadow.camera.right = 7
  sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -7
  sun.shadow.camera.far = 30
  sun.shadow.bias = -0.0004
  sun.shadow.radius = 6
  scene.add(sun)
  const rim = new THREE.DirectionalLight(dark ? 0xc9974f : 0xdfe9ff, dark ? 0.9 : 0.7)
  rim.position.set(-7, 4, -6)
  scene.add(rim)

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(16, 48),
    new THREE.ShadowMaterial({ opacity: dark ? 0.4 : 0.15 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  if (dark) {
    // glossy warm floor disc so the machine sits in a pool of showroom light
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(9.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x17110a, roughness: 0.34, metalness: 0.72, envMapIntensity: 0.85 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.005
    floor.receiveShadow = true
    scene.add(floor)
  }

  if (grid) {
    const polar = new THREE.PolarGridHelper(8.5, 12, 5, 72, dark ? 0x8a6a38 : 0xb9beb2, dark ? 0x4a3a20 : 0xd3d6cc)
    polar.position.y = 0.002
    polar.material.transparent = true
    polar.material.opacity = dark ? 0.38 : 0.32
    scene.add(polar)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(8.48, 8.53, 96),
      new THREE.MeshBasicMaterial({ color: dark ? 0xc9974f : 0xff4d00, transparent: true, opacity: dark ? 0.65 : 0.5, side: THREE.DoubleSide })
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.004
    scene.add(ring)
  }

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(...target)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.enablePan = false
  controls.enableZoom = false
  controls.minPolarAngle = 0.85
  controls.maxPolarAngle = 1.52
  controls.autoRotate = !reducedMotion()
  controls.autoRotateSpeed = -0.65
  let idleTimer = null
  controls.addEventListener('start', () => { controls.autoRotate = false; if (idleTimer) clearTimeout(idleTimer) })
  controls.addEventListener('end', () => {
    if (reducedMotion()) return
    idleTimer = setTimeout(() => { controls.autoRotate = true }, 2600)
  })

  let paused = false, raf = 0, ema = 16, frames = 0
  const tickers = []
  const clock = new THREE.Clock()

  function loop() {
    raf = requestAnimationFrame(loop)
    if (paused || document.hidden) return
    const dt = clock.getDelta()
    controls.update()
    for (const fn of tickers) fn(dt)
    renderer.render(scene, camera)
    // adaptive DPR: step down if frames run long
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
    renderer, scene, camera, controls,
    onTick: (fn) => tickers.push(fn),
    fitDistance(dist) {
      const dir = camera.position.clone().sub(controls.target).normalize()
      camera.position.copy(controls.target).addScaledVector(dir, dist)
    },
    dispose() {
      cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect()
      controls.dispose()
      renderer.dispose()
      pmrem.dispose()
      mount.removeChild(renderer.domElement)
    },
  }
}
