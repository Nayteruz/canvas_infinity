import { makeObservable, observable, action } from "mobx";
import { MutableRefObject, RefObject } from "react";

class RefStore {
    CurrentBlock: HTMLElement | null = null;
    Blocks: unknown[] = [];
    Overlay: RefObject<HTMLDivElement> | null = null;

    constructor() {
        makeObservable(this, {
            CurrentBlock: observable.ref,
            Blocks: observable.ref,
            Overlay: observable.ref,
            setOverlayRef: action,
            setCurrentBlock: action,
        })
    }

    setOverlayRef(value: RefObject<HTMLDivElement> | null) {
        this.Overlay = value
    }

    setCurrentBlock(value: HTMLElement | null) {
        this.CurrentBlock = value;
    }

    get curBlock() {
        return this.CurrentBlock;
    }
}

export default new RefStore();