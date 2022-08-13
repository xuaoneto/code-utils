import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import type { FadeProps } from "./types";

export default function Fade({
  children,
  boxStyle,
  top,
  right,
  bottom,
  left,
  ttf = "cubic-bezier(.17,.67,.72,1)", // transitionTimingFunction
  distance = "30px",
  duration = 1000,
  delay = "0",
  when,
  isMaintain = true,
  rootMargin = "-50px",
}: {
  boxStyle?: BoxProps;
  distance?: `${string}px`;
  right?: boolean;
  left?: boolean;
  top?: boolean;
  bottom?: boolean;
  ttf?:
    | "linear"
    | "ease"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | "step-start"
    | "step-end"
    | `steps(${string})`
    | `cubic-bezier(${string})`
    | `frames(${string})`;
  duration?: number;
  delay?: number | string;
  when?: boolean;
  animationSteps?: string[];
  isMaintain?: boolean;
  rootMargin?: `${string}px`;
  children: ReactNode | JSX.Element | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    const elemStyle = target.style;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!(when === undefined)) return;
        if (isMaintain) {
          if (entry.isIntersecting) {
            elemStyle.transform = "translate(0,0)";
            elemStyle.opacity = "1";
          }
        } else {
          elemStyle.transform = `translateX(${
            left ? `-${distance}` : right ? distance : 0
          }) translateY(${top ? `-${distance}` : bottom ? distance : 0})`;
          elemStyle.opacity = "0";
        }
      },
      { rootMargin }
    );
    observer.observe(target);
    return () => observer.unobserve(target);
  }, []);

  return (
    <Box
      ref={ref}
      className="fade-div"
      transitionDuration={`${duration}ms`}
      transitionTimingFunction={ttf}
      transitionDelay={`${delay}ms`}
      transitionProperty="transform, opacity"
      opacity={when ? "1" : "0"}
      transform={
        when
          ? "translate(0,0)"
          : `translateX(${
              left ? `-${distance}` : right ? distance : 0
            }) translateY(${top ? `-${distance}` : bottom ? distance : 0})`
      }
      {...boxStyle}
    >
      {children}
    </Box>
  );
}
