import { Box, Text } from "@chakra-ui/react";
import { useScroll } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

export function FloatingNames({
  name,
  distance = 300,
  toTop,
}: {
  name: JSX.Element | ReactNode;
  distance?: number;
  toTop?: boolean;
}) {
  const { scrollY } = useScroll();
  const ref = useRef<HTMLParagraphElement>();
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const target = containerRef.current;
    const { top } = target.getBoundingClientRect();
    const { top: bodyYTop } = document.body.getBoundingClientRect();
    const { innerHeight } = window;
    const calc = top - bodyYTop;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scrollY.onChange((scrollPos) => {
            const offset = scrollPos + innerHeight;
            let calcule = offset / calc - 1;
            if (calcule < 0) calcule = 0;
            ref.current.style.transform = `translateY(${toTop ? "-" : ""}${
              calcule * distance
            }px) translateZ(0px)`;
          });
        } else {
          scrollY.clearListeners();
        }
      },
      { rootMargin: "0px" }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, []);

  return (
    <Box
      ref={containerRef}
      pos="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      p="100px 14% 50px 7%"
      zIndex="-1"
      opacity="0.15"
      display={{ base: "none", xl: "block" }}
    >
      <Text
        display={{ base: "none", xl: "block" }}
        ref={ref}
        fontSize={{ xl: "100px", "2xl": "150px" }}
        fontWeight="900"
        textTransform="uppercase"
        color="rgba(0,0,0, 0.5)"
        transition="0.8s"
      >
        {name}
      </Text>
    </Box>
  );
}
