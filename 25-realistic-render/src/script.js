import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'lil-gui'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update th Material
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // environmentmap 那邊 load() 似乎是同步的，所以這邊一定會拿到 environmentmap
            // 可以直接用 scene.environment 把 scene 下面的所有物體都套上 envmap
            // child.material.envMap = environmentmap;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

/**
 * Environmentmap
 */
const environmentmap = cubeTextLoader.load([
    'textures/environmentMaps/0/px.jpg',
    'textures/environmentMaps/0/nx.jpg',
    'textures/environmentMaps/0/py.jpg',
    'textures/environmentMaps/0/ny.jpg',
    'textures/environmentMaps/0/pz.jpg',
    'textures/environmentMaps/0/nz.jpg',
])
environmentmap.encoding = THREE.sRGBEncoding;
scene.background = environmentmap;
scene.environment = environmentmap; // 這邊這樣寫，updateAllMaterials 就不用再每一個都套 envMap

debugObject.envMapIntensity = 2;
gui.add(debugObject, 'envMapIntensity').min(1).max(10).step(0.001).onChange(updateAllMaterials);

/**
 * Models
 */
gltfLoader.load('models/hamburger.glb', (gltf) => {
    gltf.scene.scale.set(0.5, 0.5, 0.5)
    gltf.scene.position.set(0, -1, 0);
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene);

    updateAllMaterials();

    gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation');
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05
/**
    bias、normalBias 設定的原因
    （bias 對平坦的表面比較有用，normalBias 對圓弧的表面比較有用）因為這邊是漢堡，所以用 normalBias
    在平坦與圓弧的表面上，容易出現 shadow acne 的問題，
    這個原因似乎是因為光線與表面越接近平行越容易出現
    我的理解，解決方法是
    設定一個檻，把產生陰影的範圍縮小一點點，讓 shadow acne 不會出現在表面上
*/
// const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionLightCameraHelper);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

/**
 * AxesHelper
 */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true; /* 將光線套用真實世界光線因距離衰減的公式 */
renderer.outputEncoding = THREE.sRGBEncoding; /*
    讓輸出的 encoding 跟 貼圖 encoding 一致，一般網頁上都是 rgb，
    threejs 預設 linear encoding，
    srgb 的色域會再廣一點（應該是）
*/
renderer.toneMapping = THREE.ReinhardToneMapping;/*
    HDR 是一種技術能保持影像上更多的細節（亮部不會完全死白...亮、暗部能呈現更多細節）
    而所謂的 toneMapping 是指，把 HDR 技術的資訊，mapping 到一個較小的量尺當中，
    因為螢幕上所呈現的顏色範圍相較於 HDR 的資訊是較小的，
    toneMapping 會盡量保留 HDR 的資訊
*/
renderer.toneMappingExposure = 3;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()