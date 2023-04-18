import * as dat from 'lil-gui';

export default class Debug {
  constructor() {
    console.log('debug start');
    this.active = window.location.hash === '#debug';

    if (this.active) {
      this.ui = new dat.GUI();
    }
  }
}