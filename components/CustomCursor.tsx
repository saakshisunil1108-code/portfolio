"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function labelFor(target: HTMLElement | null) {
  const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
  if (labelled?.dataset.cursorLabel) return labelled.dataset.cursorLabel;
  if (target?.closest("iframe")) return "VIEW";
  if (target?.closest("a")) return "OPEN";
  if (target?.closest("button")) return "VIEW";
  return "";
}

export function CustomCursor() {
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.45 });
  const smoothY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.45 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setLabel(labelFor(event.target as HTMLElement | null));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden items-center gap-2 md:flex"
      style={{ x: smoothX, y: smoothY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.14 }}
    >
      <motion.span
        className="ink-cursor-dot"
        animate={{
          scaleX: label ? [1, 1.18, 0.96, 1.08, 1] : [1, 1.08, 0.98, 1],
          scaleY: label ? [1, 0.92, 1.14, 0.98, 1] : [1, 0.96, 1.06, 1]
        }}
        transition={{ duration: label ? 1.15 : 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="ink-cursor-label"
        animate={{ opacity: label ? 1 : 0, x: label ? 0 : -4 }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
