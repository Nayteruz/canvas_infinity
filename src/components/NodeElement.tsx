import { FC, MouseEvent, useRef, useState } from "react";

interface NodeElementProps {
  left: number;
  top: number;
  text: string;
  zoom: number;
}

const NodeElement: FC<NodeElementProps> = ({
  left = 0,
  top = 0,
  text = "",
  zoom,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: left, y: top });
  const [initialMouseOffset, setInitialMouseOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLElement>(null);

  const onMouseDown = (e: MouseEvent) => {
    

    setIsDragging(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    setInitialMouseOffset({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const x = e.clientX - initialMouseOffset.x * zoom;
      const y = e.clientY - initialMouseOffset.y * zoom;
      setPosition({ x, y });
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{ transform: `matrix(1, 0, 0, 1, ${position.x}, ${position.y})` }}
      className={`node ${isDragging ? 'isDragging': ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {text}
    </div>
  );
};

export default NodeElement;
