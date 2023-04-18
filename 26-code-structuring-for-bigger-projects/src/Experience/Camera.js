import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    // 若打開 enableDamping 的話，在 tick 時，要 update
    this.controls.update()
  }
}