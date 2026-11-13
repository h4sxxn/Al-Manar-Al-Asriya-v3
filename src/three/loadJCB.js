import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const MODEL = `${import.meta.env.BASE_URL}models/jcb-3cx.glb`
const TARGET_LENGTH = 7.0 // world units — the staging the showroom was framed for

/* The real JCB 3CX — "JCB Backhoe Loader 3CX Tractor" by Kyle Burton
   (Sketchfab, CC BY 4.0). The GLB is a single merged mesh in centimetre
   units, length along Z with the loader at +Z. Normalised at runtime:
   front turned to the site's +X convention, centred on the turntable,
   grounded at y=0 and scaled to TARGET_LENGTH. onReady(ok) fires when the
   model is in place (or has failed, so the loader overlay never sticks). */
export function loadJCB(onReady) {
  const holder = new THREE.Group()
  holder.name = 'AM_jcb_real'
  new GLTFLoader().load(MODEL, (gltf) => {
    const inner = new THREE.Group()
    inner.rotation.y = Math.PI / 2 // model front (+Z) → site front (+X)
    inner.add(gltf.scene)
    holder.add(inner)
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        for (const m of mats) { if (m && 'envMapIntensity' in m) m.envMapIntensity = 0.85 }
      }
    })
    // scale so the machine's longest horizontal extent is TARGET_LENGTH
    let box = new THREE.Box3().setFromObject(holder)
    const size = box.getSize(new THREE.Vector3())
    const s = TARGET_LENGTH / Math.max(size.x, size.z)
    holder.scale.setScalar(s)
    // re-centre on the turntable axis and ground the wheels at y = 0
    box = new THREE.Box3().setFromObject(holder)
    const c = box.getCenter(new THREE.Vector3())
    holder.position.x -= c.x
    holder.position.z -= c.z
    holder.position.y -= box.min.y
    onReady?.(true)
  }, undefined, (err) => {
    console.warn('JCB 3CX model failed to load', err)
    onReady?.(false)
  })
  return holder
}
