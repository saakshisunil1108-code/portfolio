"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { assets } from "@/lib/assets";

type LetterCell = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const imageWidth = 2160;
const imageHeight = 1620;

const xCells = [
  [179, 314],
  [326, 463],
  [475, 611],
  [623, 771],
  [783, 919],
  [932, 1068],
  [1081, 1216],
  [1225, 1359],
  [1368, 1503]
] as const;

const yCells = [
  [22, 163],
  [168, 311],
  [319, 455],
  [461, 597],
  [605, 738],
  [745, 884],
  [892, 1029]
] as const;

const toCell = (id: string, x: readonly [number, number], y: readonly [number, number]): LetterCell => ({
  id,
  x: (x[0] / imageWidth) * 100,
  y: (y[0] / imageHeight) * 100,
  width: ((x[1] - x[0]) / imageWidth) * 100,
  height: ((y[1] - y[0]) / imageHeight) * 100
});

const letterCells: LetterCell[] = [
  ..."SAAKSHI".split("").map((_, index) => toCell(`saakshi-${index}`, xCells[7], yCells[index])),
  ..."PORTFOLIO".split("").flatMap((_, index) => {
    if (index === 7) return [];
    return [toCell(`portfolio-${index}`, xCells[index], yCells[6])];
  })
];

const fragments = Array.from({ length: 12 }, (_, index) => {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return {
    id: `fragment-${index}`,
    x: col * 25,
    y: row * (100 / 3),
    width: 25,
    height: 100 / 3,
    dx: [-18, -6, 8, 20][col],
    dy: [-18, 2, 18][row]
  };
});

export function CrosswordGateway() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [entering, setEntering] = useState(false);
  const root = useRef<HTMLElement>(null);
  const unlocked = revealed.size >= letterCells.length;
  const cells = useMemo(() => letterCells, []);

  const reveal = (id: string) => {
    setRevealed((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  };

  const openPortfolio = () => {
    setEntering(true);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("portfolio:open"));
      document.getElementById("portfolioViewer")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => setEntering(false), 650);
    }, 1250);
  };

  return (
    <section ref={root} id="gateway" className="paper-section-dark flex min-h-screen flex-col items-center justify-center px-4 py-24 md:px-12">
      <p className="mb-12 text-center font-display text-[0.52rem] uppercase tracking-[0.3em] text-ink/45">
        Interactive Gateway
      </p>

      <div data-cursor-label="ENTER" className={`gateway-crossword relative w-[min(680px,90vw)] overflow-hidden ${entering ? "gateway-transition-active" : ""}`}>
        <Image
          src={assets.crossword}
          alt="Saakshi Sunil portfolio crossword gateway"
          width={2048}
          height={1536}
          priority={false}
          className="block w-full object-cover"
        />

        <div className="absolute inset-0">
          {cells.map((cell) => (
            <button
              key={cell.id}
              aria-label="Reveal crossword letter"
              data-cursor-label="VIEW"
              className={`crossword-letter-cell absolute bg-[#78929a] transition-opacity duration-300 ${revealed.has(cell.id) ? "opacity-0" : "opacity-100"}`}
              style={{
                left: `${cell.x}%`,
                top: `${cell.y}%`,
                width: `${cell.width}%`,
                height: `${cell.height}%`
              }}
              onPointerEnter={() => reveal(cell.id)}
              onFocus={() => reveal(cell.id)}
              onClick={() => reveal(cell.id)}
              onTouchStart={() => reveal(cell.id)}
            />
          ))}
        </div>
        <div className="gateway-fragments pointer-events-none absolute inset-0" aria-hidden>
          {fragments.map((fragment) => (
            <span
              key={fragment.id}
              className="gateway-fragment"
              style={{
                left: `${fragment.x}%`,
                top: `${fragment.y}%`,
                width: `${fragment.width}%`,
                height: `${fragment.height}%`,
                backgroundImage: `url(${assets.crossword})`,
                backgroundSize: "400% 300%",
                backgroundPosition: `${(fragment.x / 75) * 100}% ${(fragment.y / (200 / 3)) * 100}%`,
                ["--dx" as string]: `${fragment.dx}vw`,
                ["--dy" as string]: `${fragment.dy}vh`,
                transitionDelay: `${(fragment.id.endsWith("0") ? 0 : Number(fragment.id.split("-")[1])) * 42}ms`
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <p className={`font-display text-[0.5rem] uppercase tracking-[0.25em] text-ink/45 transition-opacity ${unlocked ? "opacity-0" : "opacity-100"}`}>
          Move across the blue cells
        </p>
        <button
          data-cursor-label="ENTER"
          className={`border border-ink px-10 py-4 font-display text-[0.55rem] uppercase tracking-[0.28em] text-ink transition duration-300 hover:bg-ink hover:text-bone ${
            unlocked && !entering ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={openPortfolio}
        >
          Open Portfolio
        </button>
      </div>
    </section>
  );
}
