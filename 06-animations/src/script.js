import './style.css'
import * as THREE from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// Clocks
const clock = new THREE.Clock();


// gsap integrete
gsap.to(mesh.position, {
    x: 3,
    duration: 1,
});

// Animations
let time = Date.now();

// elapsedTime 是一個等量累加的時間，以秒為單位，這邊透過 requestAnimationFrame
// 取得每次重繪畫面時的時間

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);
    // mesh.rotation.y = elapsedTime;
    // mesh.rotation.y = elapsedTime * Math.PI * 2;

    // 讓物體畫圈圈
    // mesh.position.y = Math.cos(elapsedTime);
    // mesh.position.x = Math.sin(elapsedTime);

    // 用移動相機的方式讓物體畫圈圈
    // camera.position.y = Math.cos(elapsedTime);
    // camera.position.x = Math.sin(elapsedTime);

    // camera.lookAt(mesh.position);

    // update objects
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;
    // mesh.rotation.y += 0.002 * deltaTime;

    // render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}
tick();
