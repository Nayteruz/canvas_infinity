import { FC } from "react";
import NodeElementWrap from "./NodeElementWrap";

interface NodeElementProps {
  left: number;
  top: number;
  text: string;
  zoom: number;
}

const NodeElement: FC<NodeElementProps> = ({left, top, text = "", zoom }) => {

  return (
    <NodeElementWrap x={left} y={top} zoom={zoom}>
      <div className="node">
        {text}
      </div>
    </NodeElementWrap>
  );
};

export default NodeElement;
