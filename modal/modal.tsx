import { ReactNode, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

function createWrapperAndAppendToBody(wrapperId: string) {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

function ReactPortal({
  children,
  wrapperId = "react-portal-wrapper",
}: {
  children: ReactNode | JSX.Element;
  wrapperId: string;
}) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element!);

    return () => {
      // delete the programatically created element
      if (systemCreated && element!.parentNode) {
        element!.parentNode.removeChild(element!);
      }
    };
  }, [wrapperId]);
  // wrapperElement state will be null on the very first render.
  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}

export function Modal({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode | JSX.Element;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="modal">
        <button onClick={onClose} className="close-btn">
          Close
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </ReactPortal>
  );
}
