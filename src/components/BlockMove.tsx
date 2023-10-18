import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import useZoomBackground from "../hooks/backgroundZoomPosition";
import NodeElement from './NodeElement'
import { runInAction } from "mobx";


const BlockMove = observer(() => {

    // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

    const { storeEvents } = useStores();

    const nodeBlocks: { x: number, y: number, text: string }[] = [
        { x: 607, y: 266, text: 'node #1' },
        { x: 392, y: 123, text: 'node #2' },
        { x: 560, y: 400, text: 'node #3' },
        { x: 869, y: 369, text: 'node #4' },
        { x: 805, y: 143, text: 'node #5' },
    ];

    const layerRef = useRef<HTMLDivElement>(null);
    const nodeWrapper = useRef<HTMLDivElement>(null);

    const view = (() => {
        const positionScale = { x: 0, y: 0, scale: 1 };
        var m = positionScale;
        var scale = 1;
        const pos = { x: 0, y: 0 };
        var dirty = true;
        const API = {
            applyTo() {
                if (dirty) {
                    this.update()
                }
            },
            update() {
                dirty = false;
                m = { x: pos.x, y: pos.y, scale }
            },
            pan(amount: {x: number, y: number}) {
                if (dirty) {
                    this.update()
                }
                pos.x += amount.x;
                pos.y += amount.y;
                dirty = true;
            },
            scaleAt(at: { x: number, y: number }, amount: number) {
                if (dirty) { this.update() }
                scale *= amount;
                pos.x = at.x - (at.x - pos.x) * amount;
                pos.y = at.y - (at.y - pos.y) * amount;
                dirty = true;
            },
            getPositionScale () {
                return positionScale;
            }
        };
        return API;
    })();

    const [scale, setScale] = useState(1);
    const [panning, setPanning] = useState(false);
    const [point, setPoint] = useState({ x: 0, y: 0 });
    const [start, setStart] = useState({ x: 0, y: 0 });

    const viewZoom = useZoomBackground(view.getPositionScale().scale);

    const onKeySpaceDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            storeEvents.setGrab(true);
        }
    }

    const onKeySpaceUp = () => {
        storeEvents.setGrab(false);
    }

    const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setPanning(true);
    }

    const onMouseUp = () => {
        setPanning(false);
    }

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (!panning || !storeEvents.isGrabing) {
            return;
        }

        storeEvents.setMovePosition(e.movementX, e.movementY);

        const pos = view.pan({ x: 0, y: 0 });

        console.log(pos);
        // setPoint((prev) => ({
        //     x: prev.x + e.movementX / storeEvents.zoom,
        //     y: prev.y + e.movementY / storeEvents.zoom,
        // }))
    }

    // const scaleAt = (x: number, y: number, amount: number) => {

    //     setScale(() => {
    //         const z = Math.min(32, Math.max(0.1, storeEvents.zoom * amount));
    //         storeEvents.setZoom(z)
    //         return z;
    //     })

    //     console.log(storeEvents.left, storeEvents.top);
    // }

    const onWheel = (e: WheelEvent) => {
        e.preventDefault();

        const amount = (e.deltaY < 0 ? 1.1 : 1 / 1.1);

        const rect = layerRef.current?.parentElement?.getBoundingClientRect();
        const offsetLeft = layerRef.current?.parentElement?.offsetLeft || 0;
        const offsetTop = layerRef.current?.parentElement?.offsetTop || 0;

        const newX = e.pageX - offsetLeft - ((rect?.width || 2) / 2);
        const newY = e.pageY - offsetTop - ((rect?.height || 2) / 2);

        // scaleAt(newX, newY, amount);

        // const z = Math.min(32, Math.max(0.1, storeEvents.zoom * amount));
        runInAction(() => {
            storeEvents.setZoom(amount);
        })
        runInAction(() => {
            storeEvents.setScalePoisition(newX, newY, amount);
        })


        // setPoint((prev) => {
        //     const xx = newX - (newX - point.x) * amount;
        //     const yy = newY - (newY - point.y) * amount;

        //     console.log(point);
        //     return {
        //         x: xx,
        //         y: yy
        //     }
        // })

        // setScale(() => {
        //     const z = Math.min(32, Math.max(0.1, storeEvents.zoom * amount));
        //     storeEvents.setZoom(z)
        //     return z;
        // })
    }

    useEffect(() => {

        window.addEventListener('keydown', onKeySpaceDown);
        window.addEventListener('keyup', onKeySpaceUp);
        layerRef.current?.addEventListener('wheel', onWheel);

        return () => {
            window.removeEventListener('keydown', onKeySpaceDown);
            window.removeEventListener('keyup', onKeySpaceUp);
            layerRef.current?.removeEventListener('wheel', onWheel);
        }

    }, [])

    useEffect(() => {

    }, [point])

    return (
        <div
            className={`space ${storeEvents.isGrabing ? 'dragging' : ''}`}
            ref={layerRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            <div
                className="container"
                style={{ backgroundPosition: `${storeEvents.position.x * storeEvents.zoom}px ${storeEvents.position.y * storeEvents.zoom}px`, backgroundSize: viewZoom }}
            >
                <div
                    className="nodes-container"
                    ref={nodeWrapper}
                    style={{
                        transform: `translate(${storeEvents.position.x * storeEvents.zoom}px, ${storeEvents.position.y * storeEvents.zoom}px) scale(${storeEvents.zoom})`
                    }}
                >
                    {nodeBlocks.map(({ x, y, text }) => {
                        return (
                            <NodeElement
                                key={text}
                                pos={{ x: x, y: y }}
                                text={text}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
})

export default BlockMove;