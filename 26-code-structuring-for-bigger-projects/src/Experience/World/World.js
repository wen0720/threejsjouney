import * as THREE from 'three';
import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
  constructor() {
    this.experience = Experience.getInstance();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;

    // helper
    this.setAxesHelper();

    // Wait for resources
    this.resources.on('ready', () => {
      // setup
      this.floor = new Floor();
      this.fox = new Fox();

      // 因為 environmentMap 要帶入所有物件，所以這個要最後放
      this.environment = new Environment();
    })
  }

  setAxesHelper() {
    this.axesHelper = new THREE.AxesHelper(5);
    this.scene.add(this.axesHelper);
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}