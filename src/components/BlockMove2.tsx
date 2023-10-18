import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import NodeElement from './NodeElement'

const BlockMove = () => {

    // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

    const layerRef = useRef<HTMLDivElement>(null);
    const nodeContainerRef = useRef<HTMLDivElement>(null);
    const { refs, storeEvents } = useStores();

    const [transformMatrix, setTransformMatrix] = useState({x: 0, y: 0, scale: 1});

    const nodeBlocks: { x: number, y: number, text: string }[] = [
        { x: 607, y: 266, text: 'node #1' },
        { x: 392, y: 123, text: 'node #2' },
        { x: 560, y: 400, text: 'node #3' },
        { x: 869, y: 369, text: 'node #4' },
        { x: 805, y: 143, text: 'node #5' },
    ];

    const [mouseEv, setMouseEv] = useState({ x: 0, y: 0, oldX: 0, oldY: 0, button: false });

    const view = (() => {
        var scale = storeEvents.zoom;              // current scale
        const pos = { x: 0, y: 0 }; // current position of origin
        var dirty = true;
        const API = {
            applyTo() {
                if (dirty) { this.update() }
            },
            update() {
                dirty = false;
                setTransformMatrix({x: pos.x, y: pos.y, scale: scale})
            },
            scaleAt(at: {x: number, y: number}, amount: number, direction: 'in' | 'out') { // at in screen coords
                if (scale >= 32 && direction === 'in' || scale <= 0.1 && direction === 'out') {
                    return;
                }
                if (dirty) { this.update() }
                scale *= amount;
                const z = Math.min(32, Math.max(0.1, scale));
                storeEvents.setZoom(z)
                
                console.log(at.x, pos.x, amount, ((at.x - pos.x) * amount));
                pos.x = at.x - ((at.x - pos.x) * amount);
                pos.y = at.y - ((at.y - pos.y) * amount);
                dirty = true;
            },
        };
        return API;
    })();

    const mouseEvent = (event:MouseEvent) => {
        event.preventDefault();

        if (event.type === "mousedown") { setMouseEv((prev) => { return {...prev, button: true}}) }
        if (event.type === "mouseup" || event.type === "mouseout") { setMouseEv((prev) => { return {...prev, button: false}}) }

        
        if (mouseEv.button) { // pan
            // view.pan({ x: mouseEv.x - mouseEv.oldX, y: mouseEv.y - mouseEv.oldY });
            view.applyTo();
        }
        
    }

    useEffect(() => {

        if (!layerRef.current) {
            return;
        }


        layerRef.current.onwheel = (event: WheelEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const rect = layerRef.current?.parentElement?.getBoundingClientRect();
            const ol = layerRef.current?.parentElement?.offsetLeft;
            const ot = layerRef.current?.parentElement?.offsetTop;
            
            const x = event.pageX - ol - (rect.width / 2);
            const y = event.pageY - ot - (rect.height / 2);
            console.log(x);
            if (event.deltaY < 0) {
                view.scaleAt({ x, y }, 1.1, 'in');
                view.applyTo();
            } else {
                view.scaleAt({ x, y }, 1 / 1.1, 'out');
                view.applyTo();
            }

        }

    }, [])

    const onKeySpaceDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            storeEvents.setGrab(true);
        }
    }

    const onKeySpaceUp = () => {
        storeEvents.setGrab(false);
    }

    useEffect(() => {

        window.addEventListener('keydown', onKeySpaceDown);
        window.addEventListener('keyup', onKeySpaceUp);

        return () => {
            window.removeEventListener('keydown', onKeySpaceDown);
            window.removeEventListener('keyup', onKeySpaceUp);
        }

    }, [])

    return (
        <div
            className={`space ${storeEvents.isGrabing ? 'dragging' : ''}`}
            ref={layerRef}
            onMouseDown={mouseEvent}
            onMouseUp={mouseEvent}
            onMouseMove={mouseEvent}
            onMouseOut={mouseEvent}
        >
            <div className="container">
                <div
                    ref={nodeContainerRef}
                    className="nodes-container"
                style={{
                    transform: `translate(${transformMatrix.x}px, ${transformMatrix.y}px) scale(${transformMatrix.scale})`,
                }}
                >
                    {nodeBlocks.map(({ x, y, text }) => {
                        return (<NodeElement key={text} pos={{x: x, y: y}} text={text} />)
                    })}
                </div>
            </div>
        </div>
    );
}

export default observer(BlockMove);