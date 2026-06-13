"use client";

import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Element/tag to render as the container (e.g. "ul"). Defaults to "div". */
  as?: keyof HTMLElementTagNameMap;
  /** When set, each direct child is revealed in sequence, delayed by this many ms. */
  stagger?: number;
  /** Base delay before the reveal begins, in ms. */
  delay?: number;
  /** Direction the element enters from. Defaults to "up" (fade up). */
  from?: "up" | "left" | "right";
};

// Fade up: opacity 0 + translateY(20px) -> full opacity + 0, over 0.6s ease-out.
// prefers-reduced-motion users skip the transform/transition entirely.
const REVEAL_BASE =
  "transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:translate-x-0 motion-reduce:opacity-100";

const HIDDEN_BY_DIRECTION = {
  up: "opacity-0 translate-y-5",
  left: "opacity-0 -translate-x-8",
  right: "opacity-0 translate-x-8",
} as const;

export function ScrollReveal({
  children,
  className = "",
  as = "div",
  stagger,
  delay = 0,
  from = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visClasses = visible
    ? "opacity-100 translate-y-0 translate-x-0"
    : HIDDEN_BY_DIRECTION[from];

  if (typeof stagger === "number") {
    const revealedChildren = Children.map(children, (child, index) => {
      if (!isValidElement<{ className?: string; style?: CSSProperties }>(child)) {
        return child;
      }
      return cloneElement(child, {
        className: `${child.props.className ?? ""} ${REVEAL_BASE} ${visClasses}`.trim(),
        style: {
          ...child.props.style,
          transitionDelay: `${delay + index * stagger}ms`,
        },
      });
    });

    return createElement(
      as,
      { ref, className },
      revealedChildren,
    );
  }

  return createElement(
    as,
    {
      ref,
      className: `${REVEAL_BASE} ${visClasses} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
