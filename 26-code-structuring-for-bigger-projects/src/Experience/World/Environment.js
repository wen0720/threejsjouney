import * as THREE from 'three';
import Experience from "../Experience"

export default class Environment {
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment');
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);

    if (this.debug.active) {
      this.debugFolder.add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.01)

        this.debugFolder.add(this.sunLight.position, 'x')
          .name('sunLightX')
          .min(-5)
          .max(5)
          .step(0.01)
    }
  }

  setEnvironmentMap() {
    this.environmentMap =  {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;

    // 因為有物體在還沒有設定 envMap 之前就被加入，所以要在 travse scene 底下的 mesh 一次，更新 envMap
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true; // 這個其實是控制要不要 cache，true 就是告訴 renderer 該更新快取了
        }
      })
    }

    this.environmentMap.updateMaterials();

    // debug
    if (this.debug.active) {
      this.debugFolder.add(this.environmentMap, 'intensity')
        .name('envMapIntensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials)
    }
  }
}