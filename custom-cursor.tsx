import { Box, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorColor = useColorModeValue("#1a1a1a", "#f0f0f0");
  const mainCursor = useRef<HTMLDivElement>(null);
  const secondaryCursor = useRef<HTMLDivElement>(null);

  const cursorPosition = useRef({
    mouseX: 0,
    mouseY: 0,
    destinationX: 0,
    destinationY: 0,
    distanceX: 0,
    distanceY: 0,
    key: -1,
  });

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;

      const mouseX = clientX;
      const mouseY = clientY;

      cursorPosition.current.mouseX =
        mouseX - secondaryCursor.current!.clientWidth / 2;
      cursorPosition.current.mouseY =
        mouseY - secondaryCursor.current!.clientHeight / 2;

      mainCursor.current!.style.transform = `translate3d(${
        mouseX - mainCursor.current!.clientWidth / 2
      }px, ${mouseY - mainCursor.current!.clientHeight / 2}px, 0)`;
    });

    return () => {};
  }, []);

  useEffect(() => {
    function followMouse() {
      cursorPosition.current.key = requestAnimationFrame(followMouse);

      const {
        mouseX,
        mouseY,
        destinationX,
        destinationY,
        distanceX,
        distanceY,
      } = cursorPosition.current;
      if (!destinationX || !destinationY) {
        cursorPosition.current.destinationX = mouseX;
        cursorPosition.current.destinationY = mouseY;
      } else {
        cursorPosition.current.distanceX = (mouseX - destinationX) * 0.05;
        cursorPosition.current.distanceY = (mouseY - destinationY) * 0.05;
        if (
          Math.abs(cursorPosition.current.distanceX) +
            Math.abs(cursorPosition.current.distanceY) <
          0.1
        ) {
          cursorPosition.current.destinationX = mouseX;
          cursorPosition.current.destinationY = mouseY;
        } else {
          cursorPosition.current.destinationX += distanceX;
          cursorPosition.current.destinationY += distanceY;
        }
      }
      secondaryCursor.current!.style.transform = `translate3d(${
        destinationX - 1
      }px, ${destinationY - 1}px, 0)`;
    }
    followMouse();
  }, []);

  return (
    <>
      <Box
        ref={mainCursor}
        id="cursor"
        w="10px"
        h="10px"
        bg={cursorColor}
        pos="fixed"
        borderRadius="full"
        transform="translate3d(0, 0, 0)"
        pointerEvents="none"
        zIndex="10000"
        display={{ base: "none", xl: "block" }}
        border={`1px solid ${cursorColor}`}
      />
      <Box
        ref={secondaryCursor}
        id="secondary-cursor"
        pos="fixed"
        pointerEvents="none"
        borderRadius="full"
        transform="translate3d(0, 0, 0)"
        zIndex="10000"
        display={{ base: "none", xl: "block" }}
        w="40px"
        h="40px"
        border={`2px solid ${cursorColor}`}
      />
    </>
  );
}
