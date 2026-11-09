<script setup lang="ts">
import * as THREE from 'three'

const props = defineProps<{
  themeColor?: string
  accentColor?: string
  storeName?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let frameId: number | null = null

// Mesh references to update colors dynamically
let storeKiosk: THREE.Group | null = null
let baseMat: THREE.MeshStandardMaterial | null = null
let roofMat: THREE.MeshStandardMaterial | null = null
let accentMat: THREE.MeshStandardMaterial | null = null

onMounted(() => {
  if (!canvasRef.value) return
  const container = canvasRef.value.parentElement
  const width = container?.clientWidth || 400
  const height = container?.clientHeight || 280

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf8fafc)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 3.2, 5.5)
  camera.lookAt(0, 0.6, 0)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(5, 10, 7)
  dirLight.castShadow = true
  scene.add(dirLight)

  const fillLight = new THREE.PointLight(0xa7f3d0, 0.6)
  fillLight.position.set(-4, 2, -2)
  scene.add(fillLight)

  // Ground plane circular pedestal
  const groundGeo = new THREE.CylinderGeometry(2.6, 2.7, 0.15, 32)
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.position.y = -0.075
  ground.receiveShadow = true
  scene.add(ground)

  // 3D Kiosk Storefront
  storeKiosk = new THREE.Group()

  // Base building walls
  const buildingGeo = new THREE.BoxGeometry(2, 1.3, 1.6)
  baseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(props.themeColor || '#059669'),
    roughness: 0.3
  })
  const building = new THREE.Mesh(buildingGeo, baseMat)
  building.position.y = 0.65
  building.castShadow = true
  storeKiosk.add(building)

  // Roof awning (Striped canopy effect)
  const roofGeo = new THREE.ConeGeometry(1.6, 0.65, 4)
  roofMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(props.accentColor || '#10b981'),
    roughness: 0.2
  })
  const roof = new THREE.Mesh(roofGeo, roofMat)
  roof.position.y = 1.6
  roof.rotation.y = Math.PI / 4
  roof.castShadow = true
  storeKiosk.add(roof)

  // Window/display showcase
  const windowGeo = new THREE.BoxGeometry(1.3, 0.65, 0.08)
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  })
  const win = new THREE.Mesh(windowGeo, windowMat)
  win.position.set(0, 0.7, 0.81)
  storeKiosk.add(win)

  // Accent sign banner
  const signGeo = new THREE.BoxGeometry(1.5, 0.3, 0.05)
  accentMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4
  })
  const sign = new THREE.Mesh(signGeo, accentMat)
  sign.position.set(0, 1.25, 0.84)
  storeKiosk.add(sign)

  // Floating store badge / icon above
  const starGeo = new THREE.OctahedronGeometry(0.2, 0)
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.8
  })
  const star = new THREE.Mesh(starGeo, starMat)
  star.position.set(0, 2.1, 0)
  storeKiosk.add(star)

  scene.add(storeKiosk)

  // Render loop with gentle turntable rotation
  const animate = () => {
    frameId = requestAnimationFrame(animate)
    if (storeKiosk) {
      storeKiosk.rotation.y += 0.008
      star.rotation.y += 0.02
      star.position.y = 2.1 + Math.sin(Date.now() * 0.003) * 0.08
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()

  const handleResize = () => {
    if (!container || !renderer || !camera) return
    const newW = container.clientWidth
    const newH = container.clientHeight
    camera.aspect = newW / newH
    camera.updateProjectionMatrix()
    renderer.setSize(newW, newH)
  }
  window.addEventListener('resize', handleResize)
})

watch(() => props.themeColor, (newCol) => {
  if (baseMat && newCol) {
    baseMat.color.set(newCol)
  }
})

watch(() => props.accentColor, (newCol) => {
  if (roofMat && newCol) {
    roofMat.color.set(newCol)
  }
})

onBeforeUnmount(() => {
  if (frameId) cancelAnimationFrame(frameId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div class="relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center">
    <canvas ref="canvasRef" class="w-full h-full block" />
    <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-slate-700 shadow-xs flex items-center space-x-1.5 pointer-events-none">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>Three.js Vitrine 3D</span>
    </div>
    <div class="absolute bottom-3 inset-x-3 text-center pointer-events-none">
      <span class="text-xs font-black px-3 py-1 rounded-lg bg-slate-900/80 text-white backdrop-blur-md shadow-xs">
        {{ storeName || 'Sua Loja Virtual' }}
      </span>
    </div>
  </div>
</template>
