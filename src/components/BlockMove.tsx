import { observer } from "mobx-react-lite";
import { MouseEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
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
        zoom: 1
    });

    const nodeBlocks: { x: number, y: number, text: string }[] = [
        { x: 0, y: 0, text: 'node #1' },
        { x: 180, y: 0, text: 'node #2' },
        { x: 20, y: 160, text: 'node #3' },
        { x: 200, y: 160, text: 'node #4' },
        { x: 500, y: 100, text: 'node #5' },
    ];

    const [isDragging, setIsDragging] = useState(false);
    const [isSpaceDown, setIsSpaceDown] = useState(false);

    const onKeySpaceDown = (e: KeyboardEvent<HTMLDivElement>) => {
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

        setViewport((prev) => ({
            ...prev,
            offset: {
                x: prev.offset.x + e.movementX / viewport.zoom,
                y: prev.offset.y + e.movementY / viewport.zoom
            }
        }));
    };

    const zoomInitial = viewport.zoom * 128;
    const zoomValues = [Math.trunc(zoomInitial), 4, 8];
    let viewZoom = '';
    for (const [k, v] of zoomValues.entries()) {
        if (k === 0) {
            viewZoom += `${v}px ${v}px, ${v}px ${v}px`
        } else {
            const z = zoomValues[0] / v;
            viewZoom += `, ${z}px ${z}px, ${z}px ${z}px`
        }
    }


    useEffect(() => {
        if (!layerRef.current) {
            return;
        }

        refs.setOverlayRef(layerRef);

        layerRef.current.onwheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const speedFactor = (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);

            setViewport((prev) => {
                const prevScale = prev.zoom;
                const pinchDelta = -e.deltaY * speedFactor;
                const maxMinZoom = Math.min(32, Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta)));

                return {
                    ...prev,
                    zoom: maxMinZoom,
                };


                // experiment

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
            className={`app ${isSpaceDown ? 'dragging' : ''}`}
            ref={layerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onKeyDown={onKeySpaceDown}
            onKeyUp={onKeySpaceUp}
        >
            <div className="container" style={{ backgroundPosition: `${viewport.offset.x * viewport.zoom}px ${viewport.offset.y * viewport.zoom}px`, backgroundSize: viewZoom }}>
                <div
                    className="nodes-container"
                    ref={nodeWrapper}
                    style={{
                        transform: `translate(${viewport.offset.x * viewport.zoom}px, ${viewport.offset.y * viewport.zoom}px) scale(${viewport.zoom})`
                    }}
                >
                    {nodeBlocks.map(({ x, y, text }) => {
                        return (<NodeElement key={text} left={x} top={y} text={text} zoom={viewport.zoom} />)
                    })}
                </div>
            </div>
        </div>
    );
}

export default observer(BlockMove);