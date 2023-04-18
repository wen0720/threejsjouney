import * as THREE from 'three';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';
import sources from './sources';
import Debug from './Utils/Debug';

export default class Experience {
  static instance = null;

  constructor(canvas) {
    console.log('Here start a great experience');
    // singleton pattern
    // 保證一個類別僅有一個實例，並提供一個存取它的全域存取點
    Experience.instance = this;

    // options
    this.canvas = canvas

    // setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Tick event
    this.time.on('tick', () => {
      this.update();
    })
  }

  resize() {
    console.log('resize')
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destory() {
    this.time.off('tick');
    this.sizes.off('resize');

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (let key of child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    // orbit controls 要 dispose
    this.camera.controls.dispose();

    // renderer 要 dispose
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }

  static getInstance(canvas) {
    if (Experience.instance === null) {
      return new Experience(canvas);
    }
    return Experience.instance;
  }
}