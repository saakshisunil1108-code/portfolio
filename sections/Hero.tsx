"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/animations/registerGsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    const { gsap } = registerGsap();

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .set(".foil-signature-group", { opacity: 0 })
        .fromTo(".foil-pressure", { scale: 0.68, opacity: 0 }, { scale: 1, opacity: 0.78, duration: 1.35 })
        .to(".foil-pressure", { opacity: 0.38, duration: 0.7 }, "-=0.2")
        .fromTo(
          ".foil-signature-group",
          { opacity: 0, scale: 0.985, filter: "blur(16px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.45 },
          "-=0.85"
        )
        .fromTo(".foil-highlight-sweep", { xPercent: -120, opacity: 0 }, { xPercent: 130, opacity: 0.72, duration: 1.3 }, "-=0.55")
        .to(".scroll-cue", { opacity: 1, y: 0, duration: 0.8 }, "-=0.15");
    }, element);

    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      element.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };

    element.addEventListener("mousemove", move);
    return () => {
      element.removeEventListener("mousemove", move);
      context.revert();
    };
  }, [reduced]);

  return (
    <section ref={root} className="chrome-surface grain relative min-h-screen overflow-hidden" aria-label="Saakshi Sunil">
      <div className="foil-pressure pointer-events-none absolute left-1/2 top-1/2 h-[36vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/28 blur-3xl mix-blend-overlay" />
      <div className="foil-highlight-sweep pointer-events-none absolute inset-y-0 left-1/3 w-1/5 -skew-x-12 bg-white/45 blur-2xl mix-blend-soft-light" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <filter id="foilEmboss" x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="softAlpha" />
            <feOffset in="softAlpha" dx="-5" dy="-5" result="upperLift" />
            <feOffset in="softAlpha" dx="6" dy="7" result="lowerPress" />
            <feComposite in="upperLift" in2="SourceAlpha" operator="out" result="upperEdge" />
            <feComposite in="lowerPress" in2="SourceAlpha" operator="out" result="lowerEdge" />
            <feFlood floodColor="#ffffff" floodOpacity="0.78" result="highlightColor" />
            <feFlood floodColor="#111111" floodOpacity="0.52" result="shadowColor" />
            <feComposite in="highlightColor" in2="upperEdge" operator="in" result="highlight" />
            <feComposite in="shadowColor" in2="lowerEdge" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="highlight" />
            </feMerge>
          </filter>
        </defs>

        <g className="foil-signature-group" filter="url(#foilEmboss)">
          <text className="foil-signature foil-signature-shadow" x="50%" y="51%" textAnchor="middle" dominantBaseline="middle">
            Saakshi Sunil
          </text>
          <text className="foil-signature foil-signature-face" x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            Saakshi Sunil
          </text>
          <text className="foil-signature foil-signature-glint" x="50%" y="49.2%" textAnchor="middle" dominantBaseline="middle">
            Saakshi Sunil
          </text>
        </g>
      </svg>

      <div className="scroll-cue absolute bottom-8 left-1/2 z-10 -translate-x-1/2 translate-y-3 opacity-0">
        <div className="h-12 w-px bg-ink/45" />
      </div>
    </section>
  );
}
