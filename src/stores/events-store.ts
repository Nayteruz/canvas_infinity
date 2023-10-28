import { makeAutoObservable } from "mobx";

class EventStore {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  zoom: number = 1;
  isGrabing: boolean = false;
  position: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  setTop(value: number) {
    this.top = value;
  }

  setLeft(value: number) {
    this.left = value;
  }

  setZoom(amount: number) {
    this.zoom = amount;
  }

  setGrab(value: boolean) {
    this.isGrabing = value;
  }

  get zoomPercent() {
    return (this.zoom / 1) * 100;
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
  }

  setMovePosition(xm: number, ym: number) {
    this.position = {
      x: this.position.x + xm / this.zoom,
      y: this.position.y + ym / this.zoom,
    };
  }

  setScalePoisition(x: number, y: number, a: number) {
    const oldX = this.position.x;
    const oldY = this.position.y;
    this.position = {
      x: x - (x - oldX) * a,
      y: y - (y - oldY) * a,
    };
  }
}

export default new EventStore();
