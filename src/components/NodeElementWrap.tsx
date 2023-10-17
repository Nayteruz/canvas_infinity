import { MouseEvent as DivMouseEvent, FC, ReactNode, useEffect, useState } from "react";
import { useStores } from "../stores/root-store-context";

interface NodeElementWrapProps {
    children: ReactNode;
    x: number;
    y: number;
    zoom: number;
}

const NodeElementWrap: FC<NodeElementWrapProps> = ({ children, x, y, zoom }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: x, y: y });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { storeEvents } = useStores();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = (e.clientX - offset.x) / zoom;
                const newY = (e.clientY - offset.y) / zoom;
                setPosition({ x: newX, y: newY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset, zoom]);

    useEffect(() => {

        if (storeEvents.isGrabing) {
            setIsDragging(false);
        }

    }, [storeEvents.isGrabing])

    const handleMouseDown = (e: DivMouseEvent) => {
        if (!storeEvents.isGrabing) {
            setIsDragging(true);
        }

        const offsetX = (e.clientX - position.x * zoom);
        const offsetY = (e.clientY - position.y * zoom);
        setOffset({ x: offsetX, y: offsetY });
    };


    return (
        <div
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseDown={handleMouseDown}
            className={`node-grab-wrapper${isDragging ? ' grabbing' : ''}`}
        >
            {children}
        </div>
    );

}

export default NodeElementWrap;