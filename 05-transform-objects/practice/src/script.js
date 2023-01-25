import './style.css'
import * as THREE from 'three'
import { Vector3 } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = -2;
mesh.position.set(0.7, -0.6, -2);

// scale
// mesh.scale.x = 2;
// mesh.scale.y = 3;
mesh.scale.set(2, 3, 1);

// rotation，弧度計算，180度 = Math.PI
mesh.rotation.reorder('YXZ');
// 下面 x,y 的順序沒差，是上面設定了 rotate 的順序
// 要先 reoder，後面的才會照你 oder 的順序，預設是 'XYZ'
mesh.rotation.x = 0.3;
mesh.rotation.y = 1;



console.log(mesh.position.length()); // 相對於 0,0,0 原點的長度
console.log(mesh.position.distanceTo(new Vector3(0, 0, 0)));
// mesh.position.normalize(); // 讓向量的長度變為 1


// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);


console.log(mesh.position.distanceTo(camera.position)); // 跟鏡頭的距離長度


// lookAt 功能，可帶入 Vector3，Mesh.position 就是 vector3
// camera.lookAt(mesh.position);

// Group，可以創一個群組，裡面的東西都可以一起控制（移動）
const group = new THREE.Group();
group.position.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
group.add(cube1);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube2.position.x = -2;
group.add(cube2);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
