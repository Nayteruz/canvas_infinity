import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import useZoomBackground from "../hooks/backgroundZoomPosition";
import NodeElement from './NodeElement'


const BlockMove = () => {

    // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

    const layerRef = useRef<HTMLDivElement>(null);
    const nodeWrapper = useRef<HTMLDivElement>(null);

    const { refs } = useStores();

    const [viewport, setViewport] = useState({
        offset: {
            x: 0,
            y: 0
        },
        pos: { x: 0, y: 0 },
        zoom: 1,
        derty: true,
    });

    const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const viewZoom = useZoomBackground(zoom);

    const nodeBlocks: { x: number, y: number, text: string }[] = [
        { x: 607, y: 266, text: 'node #1' },
        { x: 392, y: 123, text: 'node #2' },
        { x: 560, y: 400, text: 'node #3' },
        { x: 869, y: 369, text: 'node #4' },
        { x: 805, y: 143, text: 'node #5' },
    ];

    const [isDragging, setIsDragging] = useState(false);
    const [isSpaceDown, setIsSpaceDown] = useState(false);

    const onKeySpaceDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            setIsSpaceDown(true);
        }
    }

    const onKeySpaceUp = () => {
        setIsSpaceDown(false);
    }

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !isSpaceDown) {
            return;
        }

        if (e.buttons !== 1) {
            setIsDragging(false);

            return;
        }

        setViewOffset((prev) => ({

            x: prev.x + e.movementX / zoom,
            y: prev.y + e.movementY / zoom,
        }))
        console.log()
        // setViewport((prev) => ({
        //     ...prev,
        //     offset: {
        //         x: prev.offset.x + e.movementX / viewport.zoom,
        //         y: prev.offset.y + e.movementY / viewport.zoom
        //     }
        // }));
    };


    useEffect(() => {
        if (!layerRef.current) {
            return;
        }

        refs.setOverlayRef(layerRef);

        layerRef.current.onwheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const speedFactor = (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);

            setZoom((prev) => {
                const pinchDelta = -e.deltaY * speedFactor;
                return Math.min(32, Math.max(0.1, prev * Math.pow(2, pinchDelta)));
            });

            setPosition((prev) => {
                const pinchDelta = -e.deltaY * speedFactor;

                const xm = e.pageX - ((layerRef.current?.clientWidth || 2) / 2);
                const ym = e.pageY - ((layerRef.current?.clientHeight || 2) / 2);

                return {
                    x: xm - (xm - prev.x) * pinchDelta,
                    y: ym - (ym - prev.y) * pinchDelta,
                }
            });

            setViewOffset((prev) => {




                return {
                    x: position.x,
                    y: position.y,
                }
            })

            setViewport((prev) => {
                const pinchDelta = -e.deltaY * speedFactor;
                const maxMinZoom = Math.min(32, Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta)));

                // return {
                //     ...prev,
                //     zoom: maxMinZoom,
                // };

                // experiment

                // let pos = { x: prev.pos.x, y: prev.pos.y };

                const x = e.pageX - ((layerRef.current?.clientWidth || 2) / 2);
                const y = e.pageY - ((layerRef.current?.clientHeight || 2) / 2);

                // if (e.deltaY < 0) {

                //     pos.x = x - (x - pos.x) * pinchDelta;
                //     pos.y = y - (y - pos.y) * pinchDelta;
                // } else { 
                //     pos.x = x - (x - pos.x) * pinchDelta;
                //     pos.y = y - (y - pos.y) * pinchDelta;
                // }

                return {
                    ...prev,
                    pos: {
                        x: x - (x - prev.pos.x) * pinchDelta,
                        y: y - (y - prev.pos.y) * pinchDelta,
                    },
                    offset: {
                        x: prev.pos.x,
                        y: prev.pos.y,
                    },
                    zoom: maxMinZoom,
                };
            });
        };
    }, [setViewport]);

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
            className={`space ${isSpaceDown ? 'dragging' : ''}`}
            ref={layerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className="container" style={{ backgroundPosition: `${viewOffset.x * zoom}px ${viewOffset.y * zoom}px`, backgroundSize: viewZoom }}>
                <div
                    className="nodes-container"
                    ref={nodeWrapper}
                    style={{
                        transform: `translate(${viewOffset.x * zoom}px, ${viewOffset.y * zoom}px) scale(${zoom})`
                    }}
                >
                    {nodeBlocks.map(({ x, y, text }) => {
                        return (<NodeElement key={text} left={x} top={y} text={text} zoom={zoom} isSpaceDown={isSpaceDown} />)
                    })}
                </div>
            </div>
        </div>
    );
}

export default observer(BlockMove);