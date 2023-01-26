import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon';

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {};

debugObject.createShpere = () => {
    // console.log('create sphere');
    createShpere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    );
}

debugObject.createBox = () => {
    // console.log('create sphere');
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    );
}

debugObject.reset = () => {
    console.log('reset');
    for (const obj of objectsToUpdate) {
        // Remove body
        obj.body.removeEventListener('collide', playHitSound);
        world.removeBody(obj.body)

        // Remove mesh
        scene.remove(obj.mesh);
    }

    // Remove objectsToUpdate Array
    objectsToUpdate.splice(0, objectsToUpdate.length);
}

gui.add(debugObject, 'createShpere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    if (impactStrength > 1.5 /* 強度超過 1.5 才發出聲音 */) {
        hitSound.volume = Math.random(); // 讓聲音有變化
        hitSound.currentTime = 0;
        hitSound.play();
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world); // 在 broadphase 階段使用 SAPBoradphase
world.allowSleep = true; // 開啟 sleep，如果物體靜止不動就不要持續監測碰撞
/**
 sleepSpeedLimit：物體多少速度以下就會進入 sleep 狀態
 sleepTimeLimit：似乎是多少秒符合 sleep 狀態後，就會進入 sleep 狀態
 */
world.gravity.set(0, -9.82, 0) // 9.82 m/s 地心引力

// Materials
const defaultMaterial = new CANNON.Material('dafault');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    }
)
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0 // 設置為 0 的話，就會變成靜止的物件，不會移動
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)
// floorBody.material = defaultContactMaterial;
world.add(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})
/**
 * Utils
 */

// sphere
const createShpere = (radius, position) => {
    // 因為每一個球的幾何結構和材質一樣，所以把 geometry 和 material 拉出去外面，可以有更好的效能
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    );
    // 再把 geometry 拉出去外面之後，半徑就必須先指定（無法在 createSphere 時才帶入）
    // 所以這邊要再把大小依照帶入的 radius scale 回去
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // cannon.js
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0), // 因為後面會在 copy position, 所以這裡隨便設一個沒關係
        shape,
        material: defaultMaterial,
    });
    body.position.copy(position)
    body.addEventListener('collide', playHitSound);
    world.add(body);

    objectsToUpdate.push({
        mesh, body
    })
}

// box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position)
    scene.add(mesh);

    // cannon.js
    // cannonjs 的 Box 是從中心點開始計算，所以只需要帶入長寬高的一半
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({
        mass: 1,
        // position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial,
    })
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.add(body);
    objectsToUpdate.push({
        mesh, body
    })
}

// createShpere(0.5, { x: 0, y: 3, z: 0 });
// createBox(1, 1, 1, { x: 0, y: 3, z: 0 })

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - elapsedTime;
    oldElapsedTime = elapsedTime

    // .step(固定的時間戳, 自上次調用函數以來經過的時間, 每個函數調用可執行的最大固定步驟數)
    world.step(1/60, deltaTime, 3)

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion); // 讓掉落的物也會跟著物理世界的物體一起旋轉
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// Update physics World
// 模擬風的運動（給 sphereBody 一個持續的受力）
// sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

// 把物理模擬的物件位置同步到 threejs 球型上
// sphere.position.copy(sphereBody.position)
