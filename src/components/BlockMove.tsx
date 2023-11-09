import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
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
    const [sPos, setSPos] = useState({x: 0, y:0});
    const [isDirty, setIsDirty] = useState(false);

    // const [start, setStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setPoint({x: zoomScale.x, y: zoomScale.y});
        setScale(zoomScale.scale);
    }, [zoomScale])

    useEffect(() => {
        storeEvents.setZoom(scale);
    }, [scale])

    useEffect(() => {
        setPoint({x: sPos.x, y: sPos.y});
    }, [sPos]);

    useEffect(() => {
        if(isDirty) {
            updateTo();
        }
    }, [isDirty])

    const updateTo = () => {
        setIsDirty(false);
        setZoomScale({ x: sPos.x, y: sPos.y, scale: scale })
    }

    const scaleTo = (at: { x: number, y: number }, amount: number) => {
        if (isDirty) {
            updateTo();
        }
        
        setScale((prev) => prev * amount);
        setSPos((prev) => {
            return {
                x: at.x - ((at.x - prev.x) * amount),
                y: at.y - ((at.y - prev.y) * amount),
            }
        })
        setIsDirty(true);
    }

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

    const onMouseUp = () => {
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
            scaleTo({ x, y }, 1.1);
        } else {
            scaleTo({ x, y }, 1 / 1.1);
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