import { useState, useEffect, ReactNode, FC } from "react";
import { createPortal } from "react-dom";

interface IframeBlockProps {
  children: ReactNode;
  styleSelector: string;
  title: string;
}

export const IframeBlock: FC<IframeBlockProps> = (props) => {
  const { children, styleSelector, title, ...other } = props;
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document.body;

  useEffect(() => {
    if (!contentRef) {
      return;
    }
    const win = contentRef?.contentWindow;

    if (win) {
      const linkEls = win.parent.document.querySelectorAll(styleSelector);
      if (linkEls.length) {
        linkEls.forEach((el) => {
          win.document.head.appendChild(el);
        });
      }
    }
  }, [contentRef, styleSelector]);

  return (
    <iframe title={title} {...other} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
