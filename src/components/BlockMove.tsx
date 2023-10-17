import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import useZoomBackground from "../hooks/backgroundZoomPosition";
import NodeElement from './NodeElement'


const BlockMove = observer(() => {

    // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

    const layerRef = useRef<HTMLDivElement>(null);
    const nodeWrapper = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(1);
    const [panning, setPanning] = useState(false);
    const [point, setPoint] = useState({x: 0, y: 0});
    const [start, setStart] = useState({x: 0, y: 0});
    
    const onMouseDown = (e: MouseEvent) => {
        console.log('mouse down');
        e.preventDefault();
        setStart({x: e.clientX - point.x, y: e.clientY - point.y});
        setPanning(true);
    }

    const onMouseUp = () => {
        setPanning(false);
    }

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (!panning) {
          return;
        }
        setPoint({
            x: e.clientX - start.x,
            y: e.clientY - start.y,
        })
    }

    const onWheel = (e: MouseEvent) => {
        e.preventDefault();
        console.log(e);
        const xs = (e.clientX - point.x) / scale;
        const ys = (e.clientY - point.y) / scale;
        let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY)

        console.log(delta);

        if (delta > 0) {
            setScale((prev) => {
                const z = prev * 1.1
                storeEvents.setZoom(z)
                return z;
            })
        } else {
            setScale((prev) => {
                const z = prev / 1.1;
                storeEvents.setZoom(z)
                return z
            })
        }
        console.log(scale);

        setPoint({
            x: e.clientX - xs * scale,
            y: e.clientY - ys * scale,
        })
    }


    const { refs, storeEvents } = useStores();

    // const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [zoom, setZoom] = useState(1);

    const viewZoom = useZoomBackground(scale);

    const nodeBlocks: { x: number, y: number, text: string }[] = [
        { x: 607, y: 266, text: 'node #1' },
        { x: 392, y: 123, text: 'node #2' },
        { x: 560, y: 400, text: 'node #3' },
        { x: 869, y: 369, text: 'node #4' },
        { x: 805, y: 143, text: 'node #5' },
    ];

    // const [isDragging, setIsDragging] = useState(false);

    const onKeySpaceDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            storeEvents.setGrab(true);
        }
    }

    const onKeySpaceUp = () => {
        storeEvents.setGrab(false);
    }

    // const handleMouseDown = () => {
    //     setIsDragging(true);
    // };

    // const handleMouseUp = () => {
    //     setIsDragging(false);
    // };

    // const handleMouseMove = (e: MouseEvent) => {
    //     if (!isDragging || !storeEvents.isGrabing) {
    //         return;
    //     }

    //     if (e.buttons !== 1) {
    //         setIsDragging(false);

    //         return;
    //     }

    //     setViewOffset((prev) => ({
    //         x: prev.x + e.movementX / zoom,
    //         y: prev.y + e.movementY / zoom,
    //     }))

    //     setPosition({
    //         x: viewOffset.x,
    //         y: viewOffset.y,
    //     })

    // };

    // useEffect(() => {
    //     if (!layerRef.current) {
    //         return;
    //     }

    //     refs.setOverlayRef(layerRef);

    //     layerRef.current.onwheel = (e: WheelEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();

    //         const speedFactor = (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);

    //         setZoom((prev) => {
    //             const pinchDelta = -e.deltaY * speedFactor;
    //             const zoom = Math.min(32, Math.max(0.1, prev * Math.pow(2, pinchDelta)));
    //             storeEvents.setZoom(zoom);
    //             return zoom;
    //         });

    //         setPosition((prev) => {
    //             const pinchDelta = -e.deltaY * speedFactor;

    //             const xm = e.pageX - ((layerRef.current?.clientWidth || 2) / 2);
    //             const ym = e.pageY - ((layerRef.current?.clientHeight || 2) / 2);

    //             return {
    //                 x: prev.x + xm - (xm - prev.x) * pinchDelta,
    //                 y: prev.x + ym - (ym - prev.y) * pinchDelta,
    //             }
    //         });

    //         setViewOffset(() => {
    //             console.log(position);
    //             return {
    //                 x: position.x,
    //                 y: position.y,
    //             }
    //         })

    //         /*setViewport((prev) => {
    //             const pinchDelta = -e.deltaY * speedFactor;
    //             const maxMinZoom = Math.min(32, Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta)));
    //             storeEvents.setZoom(maxMinZoom);

    //             // return {
    //             //     ...prev,
    //             //     zoom: maxMinZoom,
    //             // };

    //             // experiment

    //             // let pos = { x: prev.pos.x, y: prev.pos.y };

    //             const x = e.pageX - ((layerRef.current?.clientWidth || 2) / 2);
    //             const y = e.pageY - ((layerRef.current?.clientHeight || 2) / 2);

    //             // if (e.deltaY < 0) {

    //             //     pos.x = x - (x - pos.x) * pinchDelta;
    //             //     pos.y = y - (y - pos.y) * pinchDelta;
    //             // } else { 
    //             //     pos.x = x - (x - pos.x) * pinchDelta;
    //             //     pos.y = y - (y - pos.y) * pinchDelta;
    //             // }

    //             return {
    //                 ...prev,
    //                 pos: {
    //                     x: x - (x - prev.pos.x) * pinchDelta,
    //                     y: y - (y - prev.pos.y) * pinchDelta,
    //                 },
    //                 offset: {
    //                     x: prev.pos.x,
    //                     y: prev.pos.y,
    //                 },
    //                 zoom: maxMinZoom,
    //             };
    //         });*/
    //     };
    // }, [zoom, position, viewOffset]);

    useEffect(() => {

        window.addEventListener('keydown', onKeySpaceDown);
        window.addEventListener('keyup', onKeySpaceUp);
        window.addEventListener('wheel', onWheel)

        return () => {
            window.removeEventListener('keydown', onKeySpaceDown);
            window.removeEventListener('keyup', onKeySpaceUp);
            window.removeEventListener('wheel', onWheel);
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
            <div className="container" style={{ backgroundPosition: `${point.x * scale}px ${point.y * scale}px`, backgroundSize: viewZoom }}>
                <div
                    className="nodes-container"
                    ref={nodeWrapper}
                    style={{
                        transform: `translate(${point.x * scale}px, ${point.y * scale}px) scale(${scale})`
                    }}
                >
                    {nodeBlocks.map(({ x, y, text }) => {
                        return (<NodeElement key={text} left={x} top={y} text={text} zoom={scale} />)
                    })}
                </div>
            </div>
        </div>
    );
})

export default BlockMove;