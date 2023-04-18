import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0); // 起點
// const rayDirection = new THREE.Vector3(10, 0, 0); // 指向的方向，必須被 normalize
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);


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
 * Mouse
 */
const mouse = new THREE.Vector2();
let currentInersect = null;
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1 // 因為 y 軸向上為正
});

window.addEventListener('click', () => {
    if (currentInersect) {
        console.log('click in sphere')
    }
});


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
 * Model
 */
const gltfLoader = new GLTFLoader();
let model = null;
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        model = gltf.scene;
        gltf.scene.position.y = -1.2
        scene.add(gltf.scene);
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5 // 震幅
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5 // 震幅
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5 // 震幅

    // cast a ray
    raycaster.setFromCamera(mouse, camera);
    const objectToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectToTest)
    for (let obj of objectToTest) {
        obj.material.color.set('#ff0000')
    }
    for (let intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    if (intersects.length) {
        if (currentInersect === null) {
            console.log('mouse enter')
        }
        currentInersect = intersects[0]
    } else {
        if (currentInersect) {
            console.log('mouse leave')
        }
        currentInersect = null;
    }

    if (model) {
        const modelIntersect = raycaster.intersectObject(model)
        if (modelIntersect.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
        // console.log(modelIntersect)
    }

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(10, 0, 0);
    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection);
    // const objectToTest = [object1, object2, object3];
    // const intersects = raycaster.intersectObjects(objectToTest);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()