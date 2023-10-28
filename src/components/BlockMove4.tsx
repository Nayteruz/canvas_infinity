import { observer } from "mobx-react-lite";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStores } from "../stores/root-store-context";
import NodeElement from "./NodeElement";

const BlockMove = observer(() => {
  // https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position
  // https://blog.stackfindover.com/zoom-image-point-with-mouse-wheel

  const { storeEvents } = useStores();

  const nodeBlocks: { x: number; y: number; text: string }[] = [
    { x: 607, y: 266, text: "node #1" },
    { x: 392, y: 123, text: "node #2" },
    // { x: 560, y: 400, text: "node #3" },
    // { x: 869, y: 369, text: "node #4" },
    // { x: 805, y: 143, text: "node #5" },
  ];

  const layerRef = useRef<HTMLDivElement>(null);
  const nodeWrapper = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, s: 1 });
  const [scale, setScale] = useState(1);
  const [isDragLayer, setIsDragLayer] = useState(false);
  const [point, setPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const startTtansform = (xn: number, yn: number, sn: number) => {
    setTransform(() => ({
      x: xn,
      y: yn,
      s: sn,
    }));
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setStart(() => ({ x: e.clientX - point.x, y: e.clientY - point.y }));
    setIsDragLayer(true);
  };

  const onMouseUp = () => {
    setIsDragLayer(false);
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!isDragLayer) {
      return;
    }
    setPoint(() => ({ x: e.clientX - start.x, y: e.clientY - start.y }));
  };

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    layerRef.current.onwheel = (e: WheelEvent) => {
      e.preventDefault();
      // коэффициент скорола
      const speedFactorScroll =
        e.deltaMode > 100 ? 0.1 : e.deltaMode ? 1 : 0.005;
      const pinchScroll = -e.deltaY * speedFactorScroll;
      // коэффициент масштабирования
      const speedFactorScale =
        e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002;
      const pinchDelta = -e.deltaY * speedFactorScale;

      if (e.shiftKey) {
        setPoint((prev) => {
          return {
            ...prev,
            x: prev.x + -e.deltaY * pinchScroll * (e.deltaY < 0 ? -1 : 1),
          };
        });
      } else if (e.ctrlKey) {
        const xs = (e.clientX - point.x) / scale;
        const ys = (e.clientY - point.y) / scale;
        const delta = e.deltaY ? -e.deltaY : e.deltaY;

        if (delta > 0) {
          setScale((prev) => prev * (1 + pinchDelta));
        } else {
          setScale((prev) => prev / (1 - pinchDelta));
        }

        setPoint((prev) => ({
          x: prev.x + e.clientX - xs * scale,
          y: prev.y + e.clientY - ys * scale,
        }));
      } else {
        setPoint((prev) => {
          return {
            x: prev.x + -e.deltaX * pinchScroll * (e.deltaX < 0 ? -1 : 1),
            y: prev.y + -e.deltaY * pinchScroll * (e.deltaY < 0 ? -1 : 1),
          };
        });
      }
    };
  }, []);

  useEffect(() => {
    startTtansform(point.x, point.y, scale);
    storeEvents.setZoom(scale);
  }, [scale, point]);

  return (
    <div
      className={`space ${storeEvents.isGrabing ? "dragging" : ""}`}
      ref={layerRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div
        className="container"
        style={{
          backgroundPosition: `${transform.x * transform.s}px ${
            transform.y * transform.s
          }px`,
        }}
      >
        <div
          className="nodes-container"
          ref={nodeWrapper}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.s})`,
          }}
        >
          {nodeBlocks.map(({ x, y, text }, ind) => {
            return (
              <NodeElement
                key={text}
                pos={{ x: x, y: y }}
                text={text}
                scale={scale}
                index={ind}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default BlockMove;
