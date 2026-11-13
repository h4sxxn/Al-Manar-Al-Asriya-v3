import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useLang } from '../i18n'
import { makeStage } from '../three/stage'

const MODEL = `${import.meta.env.BASE_URL}models/excavator-real.glb`

/* Secondary 3D scene inside the fleet: the textured Fiat-Hitachi excavator
   on the dark showroom floor. Drag to orbit; it turns on its own and sways
   gently at the slew. The GLB ships as flat unparented meshes, so the
   articulation hierarchy is rebuilt from the part layout (as in v3's hero). */
export default function ExcavatorStage() {
  const { t } = useLang()
  const mountRef = useRef(null)
  const noteRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    const stage = makeStage(mount, { fov: 38, camPos: [-8.2, 3.1, 7.0], target: [0, 1.0, 0], dark: true })
    const fit = () => {
      const a = mount.clientWidth / Math.max(mount.clientHeight, 1)
      stage.fitDistance(a < 0.75 ? 15.5 : a < 1.15 ? 12.6 : 11.4)
    }
    fit()

    const rig = { slew: 0, boom: 0, stick: 0, bucket: 0 }
    const pivots = {}
    const _q = new THREE.Quaternion()
    const AXIS_Y = new THREE.Vector3(0, 1, 0)
    const AXIS_X = new THREE.Vector3(1, 0, 0)
    function applyRig() {
      for (const k of ['slew', 'boom', 'stick', 'bucket']) {
        const p = pivots[k]; if (!p) continue
        _q.setFromAxisAngle(p.axis, p.sign * rig[k])
        p.obj.quaternion.copy(p.q0).multiply(_q)
      }
    }

    function buildRig(root) {
      const T = new THREE.Vector3(-0.455, 0.83, -0.235)
      const seen = new Set()
      root.traverse((o) => {
        if (o.isMesh && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.translate(T.x, T.y, T.z) }
      })
      const J = {
        slew: new THREE.Vector3(-0.015, 0, -1.035),
        boom: new THREE.Vector3(-0.125, 1.78, -0.335),
        stick: new THREE.Vector3(-0.115, 4.21, 2.185),
        bucket: new THREE.Vector3(-0.125, 1.98, 3.115),
      }
      const stickDir = J.bucket.clone().sub(J.stick)
      const bucketS = stickDir.length() - 0.27
      stickDir.normalize()

      const inner = new THREE.Group()
      inner.rotation.y = -Math.PI / 2
      root.add(inner)
      const mk = (pos, parent) => { const g = new THREE.Group(); g.position.copy(pos); parent.add(g); return g }
      const slewG = mk(J.slew, inner)
      const boomG = mk(J.boom.clone().sub(J.slew), slewG)
      const stickG = mk(J.stick.clone().sub(J.boom), boomG)
      const bucketG = mk(J.bucket.clone().sub(J.stick), stickG)
      const groups = { slew: slewG, boom: boomG, stick: stickG, bucket: bucketG }

      const done = new Set()
      const place = (mesh, part) => {
        if (!done.has(mesh.geometry)) { done.add(mesh.geometry); mesh.geometry.translate(-J[part].x, -J[part].y, -J[part].z) }
        mesh.position.set(0, 0, 0)
        groups[part].add(mesh)
      }
      const splitInto = (mesh, classify) => {
        const geo = mesh.geometry
        const pos = geo.attributes.position
        const idx = geo.index.array
        const buckets = new Map()
        const c = new THREE.Vector3()
        for (let i = 0; i < idx.length; i += 3) {
          c.set(0, 0, 0)
          for (let k = 0; k < 3; k++) c.fromBufferAttribute(pos, idx[i + k])
          c.divideScalar(3)
          const key = classify(c)
          if (!buckets.has(key)) buckets.set(key, [])
          buckets.get(key).push(idx[i], idx[i + 1], idx[i + 2])
        }
        for (const [key, indices] of buckets) {
          const g2 = geo.clone()
          g2.setIndex(indices)
          const m2 = new THREE.Mesh(g2, mesh.material)
          m2.castShadow = true
          place(m2, key)
        }
        mesh.removeFromParent()
      }
      const meshesOf = (name) => {
        const obj = root.getObjectByName(name)
        const arr = []
        obj?.traverse((o) => { if (o.isMesh) arr.push(o) })
        return arr
      }

      for (const m of meshesOf('FR20trac')) inner.add(m)
      for (const n of ['FR20seat', 'FR20ligt', 'FH20glas', 'FH20cab', 'FH20blkm', 'FH20body'])
        for (const m of meshesOf(n)) place(m, 'slew')
      for (const m of meshesOf('FH20arm1')) place(m, 'boom')
      for (const m of meshesOf('FH20arm2'))
        splitInto(m, (c) => (c.clone().sub(J.stick).dot(stickDir) > bucketS ? 'bucket' : 'stick'))
      for (const m of meshesOf('FH20crom'))
        splitInto(m, (c) => (c.z < 0.965 ? 'boom' : c.y > 3.83 ? 'stick' : 'bucket'))
      for (const m of meshesOf('FR20blkp'))
        splitInto(m, (c) => (c.y > 2.15 && c.z > -0.05 ? 'boom' : 'slew'))

      pivots.slew = { obj: slewG, q0: slewG.quaternion.clone(), axis: AXIS_Y, sign: 1 }
      pivots.boom = { obj: boomG, q0: boomG.quaternion.clone(), axis: AXIS_X, sign: 1 }
      pivots.stick = { obj: stickG, q0: stickG.quaternion.clone(), axis: AXIS_X, sign: 1 }
      pivots.bucket = { obj: bucketG, q0: bucketG.quaternion.clone(), axis: AXIS_X, sign: 1 }
    }

    let modelGroup = null
    new GLTFLoader().load(MODEL, (gltf) => {
      if (disposed) return
      modelGroup = gltf.scene
      modelGroup.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true
          if (o.material) {
            const m = o.material
            m.side = THREE.DoubleSide
            if (m.name === 'yellow' || m.name === 'yellow-2') { m.roughness = 0.42; m.envMapIntensity = 1.25 }
            else if (m.name === 'Material__5') { m.metalness = 0.85; m.roughness = 0.32; m.envMapIntensity = 1.3 }
            else if ('envMapIntensity' in m) m.envMapIntensity = 0.95
          }
        }
      })
      stage.scene.add(modelGroup)
      buildRig(modelGroup)
      applyRig()
    }, undefined, () => {
      if (noteRef.current) noteRef.current.style.display = 'none'
    })

    // a slow, idle slew sway — the machine feels parked, not frozen
    stage.onTick(() => {
      const s = performance.now() * 0.00016
      rig.slew = Math.sin(s) * 0.22
      rig.boom = Math.sin(s * 1.7 + 1) * 0.03
      applyRig()
    })

    const onResize = () => fit()
    window.addEventListener('resize', onResize)
    return () => {
      disposed = true
      window.removeEventListener('resize', onResize)
      stage.dispose()
    }
  }, [])

  const x = t.fleet.excavator3d
  return (
    <div className="excavator-stage" ref={noteRef}>
      <div className="exc-head">
        <h3 className="exc-title">{x.title}</h3>
        <span className="hud">↺ {x.hint}</span>
      </div>
      <div className="exc-canvas" ref={mountRef} />
    </div>
  )
}
