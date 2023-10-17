import { makeAutoObservable } from "mobx";

class EventStore {
    left: number = 0;
    top: number = 0;
    width: number = 0;
    height: number = 0;
    zoom: number = 1;
    isGrabing: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }


    setTop(value: number) {
        this.top = value
    }

    setLeft(value: number) {
        this.left = value
    }
    
    setZoom(value:number) {
        this.zoom = value;
    }

    setGrab(value: boolean) {
        this.isGrabing = value;
    }

    get zoomPercent() {
        return this.zoom / 1 * 100;
    }
}

export default new EventStore();