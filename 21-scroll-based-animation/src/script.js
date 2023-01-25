import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        parcticlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * objects
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

// material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
});

// meshes
const objectDistance = 4;
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
);

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - objectDistance * 0;
mesh2.position.y = - objectDistance * 1;
mesh3.position.y = - objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3)

const sectionMeshs = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
// Geometry
const count = 200;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshs.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const parcticlesGeometry = new THREE.BufferGeometry();
parcticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// Material
const parcticlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
});
const particles = new THREE.Points(parcticlesGeometry, parcticlesMaterial);
scene.add(particles)

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.position.set(1, 1, 0);
scene.add(directionLight)

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
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);
    if (newSection !== currentSection) {
        currentSection = newSection
        gsap.to(sectionMeshs[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })
    }
});

const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate Camera
    // 因為要達成移動 100vh，鏡頭就移動 1個objectDistance，所以一個 sizes.height 等價於一個 objectDistance
    // 因此用 scrollY / sizes.height 去算目前移動多少個 sizes.height，再乘 objectDistance
    camera.position.y = -1 * scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x * 0.5;
    const parallaxY = - cursor.y * 0.5;
    // 用 deltaTime 的原因是，要武里有先電腦更新的頻率比較快，所以用 deltaTime 去處理
    // 而 5 是隨機給的數值，可自行調整
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // Animate
    for (const mesh of sectionMeshs) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.1;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()