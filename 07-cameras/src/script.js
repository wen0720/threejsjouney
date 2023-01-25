import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Cursor
// const cursor = { x: 0, y: 0 };
// window.addEventListener('mousemove', (event) => {
//     cursor.x = (event.clientX / sizes.width) - 0.5;
//     cursor.y = -((event.clientY / sizes.height) - 0.5);
//     // console.log(cursor);
// });

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)

// OrthographicCamera 正交相機，所有物體不會因為與相機距離而變大或變小
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
// camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const orbitControl = new OrbitControls(camera, canvas)
orbitControl.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Update camera
    // console.log(Math.sin(cursor.x * Math.PI * 2));


    /*  因為使用 orbitControl，這邊就先不用了
        // 讓攝影機在 x/z 軸上畫圈
        // Math.PI * 2 等價於 360度，cursor.x 在 -0.5~0.5 之間 所以，
        // Math.sin(cursor.x * Math.PI * 2) 在 sin(-180) ~ sin(180) 之間，也就是一圈
        // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
        // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
        // camera.position.y = cursor.y * 10;
        // camera.lookAt(mesh.position);
    */

    // 有 enableDamping 的話，tick 要 update
    orbitControl.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
