"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 420, damping: 38 });
  const smoothY = useSpring(y, { stiffness: 420, damping: 38 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (event: MouseEvent) => {
      x.set(event.clientX - 10);
      y.set(event.clientY - 10);
      setVisible(true);
    };
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setActive(Boolean(target.closest("a, button, [data-cursor='archive']")));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", over);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-5 w-5 rounded-full border border-ink/70 mix-blend-difference md:block"
      style={{ x: smoothX, y: smoothY }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: active ? 2.5 : 1,
        backgroundColor: active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0)"
      }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    />
  );
}
