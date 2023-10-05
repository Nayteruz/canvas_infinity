import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";

const BlockMove = () => {

    const layerRef = useRef<HTMLDivElement>(null);
    const { refs } = useStores();

    const [viewport, setViewport] = useState({
        offset: {
        x: 0.0,
        y: 0.0
        },
        zoom: 1
    });

    const nodeBlocks: {x: number, y: number, text: string}[] = [
        {x: 60, y: 20, text: 'node #1'},
        {x: 150, y: 230, text: 'node #2'},
        {x: 350, y: 330, text: 'node #3'},
        {x: 600, y: 1200, text: 'node #4'},
        {x: 200, y: 500, text: 'node #5'},
    ];

    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const onNodeMouseDown = (e: MouseEvent) => {
        const pos = e.target.style.transform?.replace(/[a-z\(\)]/g, '').split(', ');
        e.target.style.transform = `translate(${+pos[0] + 5}px, ${+pos[1] + 5}px)`

        refs.setCurrentBlock(e.target as HTMLElement);
        console.log(e, pos);
    }

    const onNodeMouseUp = (e: MouseEvent) => {
        refs.setCurrentBlock(null);
    }


    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) {
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

    useEffect(() => {
        if (!layerRef.current) {
        return;
        }

        refs.setOverlayRef(layerRef);

        layerRef.current.onwheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        //if (e.ctrlKey) {
            const speedFactor =
            (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);

            setViewport((prev) => {
            const pinchDelta = -e.deltaY * speedFactor;

            return {
                ...prev,
                zoom: Math.min(
                1,
                Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta))
                )
            };
            });
        //}
        };
    }, [setViewport]);

    return (
        <div
        className="app"
        ref={layerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        >
        <div className="container">
            <div
            className="nodes-container"
            style={{transform: `translate(${viewport.offset.x * viewport.zoom}px, ${viewport.offset.y * viewport.zoom}px) scale(${viewport.zoom})`
            }}
            >
                {nodeBlocks.map(({x, y, text}) => {
                    return (<div
                        style={{transform: `translate(${x}px, ${y}px)`}}
                        className="node"
                        key={text}
                        onMouseDown={onNodeMouseDown}
                        onMouseUp={onNodeMouseUp}
                    >
                        {text}
                    </div>)
                })}
            </div>
        </div>
        </div>
    );
}

export default observer(BlockMove);