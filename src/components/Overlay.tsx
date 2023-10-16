import { observer } from "mobx-react-lite";
import { useStores } from "../stores/root-store-context";
import { useEffect, useRef, MouseEvent } from "react";

const Overlay = () => {

    const { storeEvents, refs } = useStores();
    const refOverlay = useRef(null);

    useEffect(() => {
        refs.setOverlayRef(refOverlay.current);
    }, [])

    const onMouseDown = (e: MouseEvent) => {
        storeEvents.setTop(Number(e.clientY));
        storeEvents.setLeft(Number(e.clientX));

        console.log(refs.CurrentBlock)
        if (refs.CurrentBlock) {
            console.log(e.target);
        } 
    }

    const onMouseMove = (e: MouseEvent) => {
        storeEvents.setTop(Number(e.clientY));
        storeEvents.setLeft(Number(e.clientX));
    }


    return <div ref={refOverlay} onMouseMove={onMouseMove} onMouseDown={onMouseDown} className="overlay"></div>
}

export default observer(Overlay);