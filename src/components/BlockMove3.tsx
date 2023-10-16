import { observer } from "mobx-react-lite";
import { MouseEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import NodeElement from './NodeElement'

const BlockMove = () => {

    // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

    const layerRef = useRef<HTMLDivElement>(null);
    const nodeContainerRef = useRef<HTMLDivElement>(null);
    const { refs } = useStores();

    const [viewport, setViewport] = useState({
        offset: {
            x: 0.0,
            y: 0.0
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

    const zoom128 = viewport.zoom * 128;
    const zoom32 = viewport.zoom * 32;
    const zoom16 = viewport.zoom * 16;
    const viewZoom = `${zoom128}px ${zoom128}px, ${zoom128}px ${zoom128}px, ${zoom32}px ${zoom32}px, ${zoom32}px ${zoom32}px, ${zoom16}px ${zoom16}px, ${zoom16}px ${zoom16}px`;

    useEffect(() => {
        if (!layerRef.current) {
            return;
        }



        refs.setOverlayRef(layerRef);

        layerRef.current.onwheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const speedFactor = (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);



            // if (e.deltaY < 0) {
            //     view.scaleAt({ x, y }, 1.1, 'in');
            //     view.applyTo();
            // } else {
            //     view.scaleAt({ x, y }, 1 / 1.1, 'out');
            //     view.applyTo();
            // }


            setViewport((prev) => {

                const rect = layerRef.current?.parentElement?.getBoundingClientRect();
                const offsetLeft = nodeContainerRef.current?.offsetLeft || 0;
                const offsetTop = nodeContainerRef.current?.offsetTop || 0;

                const computedNodeContainer = getComputedStyle(nodeContainerRef.current);
                const trans = computedNodeContainer.transform;
                const matrix = new DOMMatrix(trans);

                console.log(matrix);

                const x = e.pageX - matrix.m41 - (rect?.width || 2 / 2);
                const y = e.pageY - matrix.m42 - (rect?.height || 2 / 2);

                const pinchDelta = -e.deltaY * speedFactor;
                const ofsX = prev.offset.x;
                const ofsY = prev.offset.y;

                console.dir(nodeContainerRef.current)
                console.log(x - (x - ofsX) * e.deltaY < 0 ? 1.1 : 1/1.1);

                return {
                    // ...prev,
                    offset: {
                        x: x - (x - ofsX) * (-e.deltaY < 0 ? 1.1 : 1/1.1), // Math.abs(pinchDelta),
                        y: y - (y - ofsY) * (-e.deltaY < 0 ? 1.1 : 1/1.1), // pinchDelta,
                    },
                    zoom: Math.min(
                        32,
                        Math.max(0.1, prev.zoom *= (-e.deltaY < 0 ? 1.1 : 1/1.1))
                    )
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
                    ref={nodeContainerRef}
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