import { makeAutoObservable } from "mobx";

class EventStore {
    left: number = 0;
    top: number = 0;
    width: number = 0;
    height: number = 0;

    constructor() {
        makeAutoObservable(this)
    }


    setTop(value: number) {
        this.top = value
    }

    setLeft(value: number) {
        this.left = value
    }
}

export default new EventStore();