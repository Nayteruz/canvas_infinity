import { FC, MouseEvent, useRef, useState } from "react";
import NodeElementWrap from "./NodeElementWrap";

interface NodeElementProps {
  left: number;
  top: number;
  text: string;
  zoom: number;
  isSpaceDown: boolean;
}

const NodeElement: FC<NodeElementProps> = ({left, top, text = "", zoom, isSpaceDown }) => {

  return (
    <NodeElementWrap x={left} y={top} zoom={zoom} isSpaceDown={isSpaceDown}>
      <div className="node">
        {text}
      </div>
    </NodeElementWrap>
  );
};

export default NodeElement;
