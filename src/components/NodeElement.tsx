import { FC } from "react";
import NodeElementWrap from "./NodeElementWrap";
import { IframeBlock } from "./IframeBlock";
import { observer } from "mobx-react-lite";

interface NodeElementProps {
  pos: { x: number; y: number };
  text: string;
  scale: number;
  index: number;
}

const NodeElement: FC<NodeElementProps> = observer(
  ({ pos, text = "", scale = 1, index }) => {
    return (
      <>
        <NodeElementWrap pos={pos} scale={scale}>
          <link
            data-frame={index}
            type="text/css"
            rel="stylesheet"
            href="./stylesFrame.css"
          />
          <IframeBlock
            key={text}
            title={text}
            styleSelector={`link[data-frame="${index}"]`}
          >
            <p>{text}</p>
            <div>{text}</div>
          </IframeBlock>
        </NodeElementWrap>
        <NodeElementWrap pos={{ x: pos.x + 400, y: pos.y }} scale={scale}>
          <link
            data-frame={index}
            type="text/css"
            rel="stylesheet"
            href="./stylesFrame.css"
          />
          <IframeBlock
            key={text}
            title={text}
            styleSelector={`link[data-frame="${index}"]`}
          >
            <p>{text}</p>
            <div>{text}</div>
          </IframeBlock>
        </NodeElementWrap>
      </>
    );
  }
);

export default NodeElement;
