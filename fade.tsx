import { useRef } from "react";
import type { FadeProps } from "./types";
import { Box } from "@chakra-ui/react";
import { useInViewport } from "hooks/use-in-view-port";

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
  children: ReactNode | JSX.Element;
}) {
  const ref = useRef<HTMLDivElement>(null);
  let isVisible = useInViewport(ref, "-50px", isMaintain);
  if (!(when === undefined)) isVisible = when;

  return (
    <Box
      ref={ref}
      className="fade-div"
      transitionDuration={`${duration}ms`}
      transitionTimingFunction={ttf}
      transitionDelay={`${delay}ms`}
      transitionProperty="transform, opacity"
      opacity={isVisible ? "1" : "0"}
      transform={
        isVisible
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
