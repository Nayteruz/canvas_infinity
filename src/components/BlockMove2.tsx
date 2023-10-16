import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import NodeElement from './NodeElement'

const BlockMove = () => {

    // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

    const layerRef = useRef<HTMLDivElement>(null);
    const nodeContainerRef = useRef<HTMLDivElement>(null);
    const { refs } = useStores();

    const [transformMatrix, setTransformMatrix] = useState([1, 0, 0, 1, 0, 0]);

    const nodeBlocks: { x: number, y: number, text: string }[] = [
        { x: 0, y: 0, text: 'node #1' },
        { x: 180, y: 0, text: 'node #2' },
        { x: 20, y: 160, text: 'node #3' },
        { x: 200, y: 160, text: 'node #4' },
        { x: 500, y: 100, text: 'node #5' },
    ];

    const [mouseEv, setMouseEv] = useState({ x: 0, y: 0, oldX: 0, oldY: 0, button: false });

    const view = (() => {
        var scale = 1;              // current scale
        const pos = { x: 0, y: 0 }; // current position of origin
        var dirty = true;
        const API = {
            applyTo() {
                if (dirty) { this.update() }
            },
            update() {
                dirty = false;
                setTransformMatrix([
                    scale,
                    0,
                    0,
                    scale,
                    pos.x,
                    pos.y,
                ])
            },
            pan(amount: {x:number, y: number}) {
                if (dirty) { this.update() }
                pos.x += amount.x;
                pos.y += amount.y;

                dirty = true;
            },
            scaleAt(at: {x: number, y: number}, amount: number, direction: 'in' | 'out') { // at in screen coords
                console.log(direction, scale)
                if (scale >= 32 && direction === 'in' || scale <= 0.1 && direction === 'out') {
                    return;
                }
                if (dirty) { this.update() }
                scale *= amount;
                pos.x = at.x - (at.x - pos.x) * amount;
                pos.y = at.y - (at.y - pos.y) * amount;
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
            view.pan({ x: mouseEv.x - mouseEv.oldX, y: mouseEv.y - mouseEv.oldY });
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

            if (event.deltaY < 0) {
                view.scaleAt({ x, y }, 1.1, 'in');
                view.applyTo();
            } else {
                view.scaleAt({ x, y }, 1 / 1.1, 'out');
                view.applyTo();
            }

        }

    }, [])


    console.log(transformMatrix);

    /*      */

    // const matrixView = (() => {
    //     let m = [1, 0, 0, 1, 0, 0];
    //     let scale = 1;
    //     const pos = { x: 0, y: 0 };
    //     let dirty = true;

    //     const applyTo = () => {
    //         if (dirty) update();
    //         return m;
    //     };

    //     const pan = (amount:{x: number, y: number}) => {
    //         if (dirty) update();
    //          pos.x += amount.x;
    //          pos.y += amount.y;
    //          dirty = true;
    //       };

    //     const update = () => {
    //         dirty = false;
    //         m = [scale, 0, 0, scale, pos.x, pos.y];
    //     };

    //     const scaleAt = (at: { x: number, y: number }, amount: number) => {
    //         if (dirty) update();
    //         scale *= amount;
    //         pos.x = at.x - (at.x - pos.x) * amount;
    //         pos.y = at.y - (at.y - pos.y) * amount;
    //         dirty = true;
    //         return m;
    //     };

    //     return { applyTo, scaleAt, update, pan };
    // })();


    // // const view = (() => {
    // //     const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
    // //     var m = matrix;             // alias 
    // //     var scale = 1;              // current scale
    // //     const pos = { x: 0, y: 0 }; // current position of origin
    // //     var dirty = true;
    // //     const API = {
    // //         applyTo<T extends HTMLElement>(el: T) {
    // //             if (dirty) { this.update() }
    // //             el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
    // //             return m;
    // //         },
    // //         update() {
    // //             dirty = false;
    // //             m[3] = m[0] = scale;
    // //             m[2] = m[1] = 0;
    // //             m[4] = pos.x;
    // //             m[5] = pos.y;
    // //         },
    // //         scaleAt(at: { x: number, y: number }, amount: number) { // at in screen coords
    // //             if (dirty) { this.update() }
    // //             scale *= amount;
    // //             pos.x = at.x - (at.x - pos.x) * amount;
    // //             pos.y = at.y - (at.y - pos.y) * amount;
    // //             dirty = true;
    // //         },
    // //     };
    // //     return API;
    // // })();

    // const [viewport, setViewport] = useState({
    //     matrix: [1, 0, 0, 1, 0, 0],
    //     zoom: 1
    // });

    // const nodeBlocks: { x: number, y: number, text: string }[] = [
    //     { x: 0, y: 0, text: 'node #1' },
    //     { x: 180, y: 0, text: 'node #2' },
    //     { x: 20, y: 160, text: 'node #3' },
    //     { x: 200, y: 160, text: 'node #4' },
    //     { x: 500, y: 100, text: 'node #5' },
    // ];

    // const [isDragging, setIsDragging] = useState(false);
    // const [isSpaceDown, setIsSpaceDown] = useState(false);

    // const onKeySpaceDown = (e: KeyboardEvent) => {
    //     if (e.code === 'Space') {
    //         setIsSpaceDown(true);
    //     }
    // }

    // const onKeySpaceUp = () => {
    //     setIsSpaceDown(false);
    // }

    // const handleMouseDown = () => {
    //     setIsDragging(true);
    // };

    // const handleMouseUp = () => {
    //     setIsDragging(false);
    // };

    // const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, button: false};
    // const handleMouseMove = (e: MouseEvent) => {

    //     /*
    //     mouse.oldX = mouse.x;
    //     mouse.oldY = mouse.y;
    //     mouse.x = event.pageX;
    //     mouse.y = event.pageY;
    //     if(mouse.button) { // pan
    //         view.pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
    //         view.applyTo(zoomMe);
    //     }
    //     event.preventDefault();
    //     */

    //     if (!isDragging || !isSpaceDown) {
    //         return;
    //     }

    //     if (e.buttons !== 1) {
    //         setIsDragging(false);

    //         return;
    //     }

    //     mouse.oldX = mouse.x;
    //     mouse.oldY = mouse.y;
    //     mouse.x = e.pageX;
    //     mouse.y = e.pageY;
    //     matrixView.pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
    //     setViewport((prev) => ({
    //         ...prev,
    //         matrix: [...scaleElement(matrixView, e.movementX, e.movementY, viewport.zoom)]
    //     }));
    // };

    // const values = [128, 32, 16];
    // let viewZoom = [];

    // for (const value of values) {
    //     const v = Math.round(viewport.matrix[0] * value);
    //     viewZoom.push(v);
    // }

    // const zoomRest = () => {
    //     const values = [1, 4, 8];
    //     const maxZoomValue = 128;
    //     const maxZoom = Math.round(viewport.matrix[0] * maxZoomValue);
    //     let viewZoom = "";

    //     for (const value of values) {
    //         const v = maxZoom / value;
    //         viewZoom += `${viewZoom ? ', ' : ''}${v}px ${v}px, ${v}px ${v}px`;
    //     }
    //     return viewZoom;
    // }

    // const transformMatrix = (): string => {
    //     const matrix = viewport.matrix.join(',');
    //     return 'matrix(' + matrix + ')'
    // }

    // const scaleElement = (matrixView, x: number, y: number, scale: number) => {
    //     matrixView.scaleAt({ x, y }, scale);
    //     return matrixView.applyTo();
    // }

    // useEffect(() => {
    //     if (!layerRef.current) {
    //         return;
    //     }



    //     refs.setOverlayRef(layerRef);

    //     layerRef.current.onwheel = (e: WheelEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();

    //         const speedFactor =
    //             (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);
    //         const { offsetLeft, offsetTop } = layerRef.current?.offsetParent as HTMLElement || {};

    //         setViewport((prev) => {
    //             const pinchDelta = -e.deltaY * speedFactor;
    //             let transform;

    //             const { width, height } = layerRef.current?.getBoundingClientRect() as DOMRect;

    //             const x = (e.pageX - offsetLeft || 0) - (width / 2);
    //             const y = (e.pageY - offsetTop || 0) - (height / 2);

    //             if (e.deltaY < 0) {
    //                 transform = scaleElement(matrixView, x, y, 1.05);
    //             } else {
    //                 transform = scaleElement(matrixView, x, y, 1 / 1.05);
    //             }

    //             return {
    //                 matrix: transform,
    //                 zoom: Math.min(
    //                     100,
    //                     Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta))
    //                 )
    //             };
    //         });
    //     };
    // }, [setViewport]);

    // useEffect(() => {

    //     window.addEventListener('keydown', onKeySpaceDown);
    //     window.addEventListener('keyup', onKeySpaceUp);

    //     return () => {
    //         window.removeEventListener('keydown', onKeySpaceDown);
    //         window.removeEventListener('keyup', onKeySpaceUp);
    //     }

    // }, [])


    return (
        <div
            className={`app ${true ? 'dragging' : ''}`}
            ref={layerRef}
            onMouseDown={mouseEvent}
            onMouseUp={mouseEvent}
            onMouseMove={mouseEvent}
            onMouseOut={mouseEvent}
        // onKeyDown={onKeySpaceDown}
        // onKeyUp={onKeySpaceUp}
        >
            <div className="container"
            // style={{ backgroundPosition: `${viewport.matrix[4] * viewport.zoom}px ${viewport.matrix[5] * viewport.zoom}px`, backgroundSize: zoomRest() }}
            >
                <div
                    ref={nodeContainerRef}
                    className="nodes-container"
                style={{
                    transform: `matrix(${transformMatrix.join(', ')})`,
                }}
                >
                    {nodeBlocks.map(({ x, y, text }) => {
                        return (<NodeElement key={text} left={x} top={y} text={text} zoom={1} />)
                    })}
                </div>
            </div>
        </div>
    );
}

export default observer(BlockMove);