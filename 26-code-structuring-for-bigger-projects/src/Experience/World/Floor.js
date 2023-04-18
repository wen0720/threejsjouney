import * as THREE from 'three';
import Experience from "../Experience"

export default class Floor {
  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  setTextures() {
    this.textures = {};
    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    // normal map 不需要設定 sRGB encoding
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }


  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = - Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  // setFloor() {
  //   this.floor = new THREE.Mesh(
  //     new THREE.PlaneGeometry(5, 5, 5),
  //     new THREE.MeshStandardMaterial({
  //       map: this.resources.items.grassColorTexture,
  //       normalMap: this.resources.items.grassNormalTexture
  //     })
  //   )
  //   this.floor.rotation.set(-Math.PI * 0.5, 0, 0)
  //   this.floor.position.set(0, -0.5, 0);
  //   console.log(this.floor)

  //   this.scene.add(this.floor)
  // }
}