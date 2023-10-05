import { makeAutoObservable, makeObservable, observable, action } from "mobx";
import { MutableRefObject } from "react";

class RefStore {
    CurrentBlock: unknown | null = null;
    Blocks: unknown[] = [];
    Overlay: unknown | null = null;

    constructor() {
        makeObservable(this, {
            CurrentBlock: observable.ref,
            Blocks: observable.ref,
            Overlay: observable.ref,
            setOverlayRef: action,
            setCurrentBlock: action,
        })
    }

    setOverlayRef(value: MutableRefObject<HTMLDivElement> | null) {
        this.Overlay = value
    }

    setCurrentBlock(value: MutableRefObject<HTMLDivElement> | null) {
        this.CurrentBlock = value;
    }

    get curBlock() {
        return this.CurrentBlock;
    }
}

export default new RefStore();