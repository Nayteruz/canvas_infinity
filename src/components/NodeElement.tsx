import { FC } from "react";
import NodeElementWrap from "./NodeElementWrap";

interface NodeElementProps {
  pos:{x: number, y: number}
  text: string;
}

const NodeElement: FC<NodeElementProps> = ({pos, text = "" }) => {

  return (
    <NodeElementWrap pos={pos}>
      <div className="node">
        {text}
      </div>
    </NodeElementWrap>
  );
};

export default NodeElement;
