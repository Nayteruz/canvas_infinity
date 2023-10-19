import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import useZoomBackground from "../hooks/backgroundZoomPosition";
import NodeElement from './NodeElement'


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

    const [scale, setScale] = useState(1);
    const [point, setPoint] = useState({ x: 0, y: 0 });
    const [zoomScale, setZoomScale] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);

    // const [start, setStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setPoint({x: zoomScale.x, y: zoomScale.y});
        setScale(zoomScale.scale);
    }, [zoomScale])

    const view = (() => {
        let scale = 1;
        const pos = { x: 0, y: 0 };

        let dirty = true;
        const API = {
            applyTo() {
                if (dirty) {
                    this.update()
                }
            },
            update() {
                dirty = false;
                setZoomScale({ x: pos.x, y: pos.y, scale: scale })
            },
            scaleAt(at: { x: number, y: number }, amount: number, d: 'in' | 'out') {
                if (scale >= 32 && d === 'in' || scale <= 0.1 && d === 'out') {
                    return;
                }
                if (dirty) {
                    this.update();
                }
                
                scale *= amount;
                
                pos.x = at.x - ((at.x - pos.x) * amount);
                pos.y = at.y - ((at.y - pos.y) * amount);
                dirty = true;
            },
        };
        return API;
    })();

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
        setIsDragging(true);
    }

    const onMouseUp = (e: MouseEvent) => {
        setIsDragging(false);
    }

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (!isDragging || !storeEvents.isGrabing) {
            return;
        }
        if (e.buttons !== 1) {
            setIsDragging(false);

            return;
        }
        setPoint((prev) => {
            return {
                x: prev.x + e.movementX,
                y: prev.y + e.movementY
            }
        })
    }


    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = layerRef.current?.parentElement?.getBoundingClientRect();
        const offsetLeft = layerRef.current?.parentElement?.offsetLeft || 0;
        const offsetTop = layerRef.current?.parentElement?.offsetTop || 0;

        const x = e.pageX - offsetLeft - ((rect?.width || 2) / 2);
        const y = e.pageY - offsetTop - ((rect?.height || 2) / 2);

        if (e.deltaY < 0) {
            view.scaleAt({ x, y }, 1.1, 'in');
            view.applyTo();
        } else {
            view.scaleAt({ x, y }, 1 / 1.1, 'out');
            view.applyTo();
        }
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
                style={{ backgroundPosition: `${point.x * scale}px ${point.y * scale}px` }}
            >
                <div
                    className="nodes-container"
                    ref={nodeWrapper}
                    style={{
                        transform: `translate(${point.x}px, ${point.y}px) scale(${scale})`,
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