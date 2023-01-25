import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextLoader = new THREE.CubeTextureLoader(); // 拿來 load 成為 env map 的
const environmentMapTexture =  cubeTextLoader.load([ // loading 順序很重要 positive x, negative x, positive y....
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])


const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/4.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// const material = new THREE.MeshBasicMaterial({
//     map: doorColorTexture,
// });
// init 之後，color 會變成 THREE.Color，要直接賦值給 material 的話，要 new THREE.color
// 或是用 new THREE.color 的 set
// material.color = new THREE.Color('#ff00ff')
// material.color.set('#ff00ff');

// material.transparent = true;
// material.opacity = 0.6;
/**
 * 使用 alphamap 時，material.transparent 也必須為 true。其實 alphamap 就像是 ps 的遮罩。
 */
// material.alphaMap = doorAlphaTexture;

// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

/**
 Matcap
 const material = new THREE.MeshMatcapMaterial();
 material.matcap = matcapTexture;
 */


// const material = new THREE.MeshDepthMaterial();

// ===== 會受燈影響的 material //
// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000 // 調整反光的強度
// material.specular = new THREE.Color(0xff00ff) // 反光的顏色

// const material = new THREE.MeshToonMaterial();
/**
 * gradientTexture 本來只有 3 個顏色，但是因為貼圖太小，Three 預設 linear 模式，
 * 讓整個圖案被拉長模糊了
 * 所以設定 NearestFilter
 */
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture; // 可以用 gradientMap 去控制顏色層次


// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 0.25;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture; // 增加陰影強度
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture; // 改變 vertex 的高度
// material.displacementScale = 0.05
// material.normalMap = doorNormalTexture; // 增加物件細節
// material.normalScale.set(0.7, 0.7);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// ====== env map ==== //
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;
// ====== env map ==== //

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01)
gui.add(material, 'displacementScale').min(0).max(10).step(0.01)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)

sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2) // 1 個 vertex 用 2 個值表示
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), material);

plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2) // 1 個 vertex 用 2 個值表示
)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
torus.position.x = 1.5

torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2) // 1 個 vertex 用 2 個值表示
)

scene.add(sphere, plane, torus);


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // color, intensity
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
