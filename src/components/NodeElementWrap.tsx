import { MouseEvent as DivMouseEvent, FC, ReactNode, useEffect, useState } from "react";
import { useStores } from "../stores/root-store-context";

interface NodeElementWrapProps {
    children: ReactNode;
    pos: {x: number, y: number}
}

const NodeElementWrap: FC<NodeElementWrapProps> = ({ children, pos }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: pos.x, y: pos.y });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { storeEvents } = useStores();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = (e.clientX - offset.x) / storeEvents.zoom;
                const newY = (e.clientY - offset.y) / storeEvents.zoom;
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
    }, [isDragging, offset, storeEvents.zoom]);

    useEffect(() => {
        if (storeEvents.isGrabing) {
            setIsDragging(false);
        }

    }, [storeEvents.isGrabing])

    const handleMouseDown = (e: DivMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!storeEvents.isGrabing) {
            setIsDragging(true);
        }

        const offsetX = (e.clientX - position.x * storeEvents.zoom);
        const offsetY = (e.clientY - position.y * storeEvents.zoom);
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