import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0; // 目前經過了多少時間
    this.delta = 16;

    // 等一個 frame 才執行，原因待說明
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.trigger('tick');

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}