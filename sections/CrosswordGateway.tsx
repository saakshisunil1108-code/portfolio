"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { assets } from "@/lib/assets";

type LetterCell = {
  id: string;
  letter: string;
  col: number;
  row: number;
};

const saakshi = "SAAKSHI".split("").map((letter, index) => ({
  id: `saakshi-${index}`,
  letter,
  col: 9,
  row: index + 1
}));

const portfolio = "PORTFOLIO".split("").map((letter, index) => ({
  id: `portfolio-${index}`,
  letter,
  col: index + 2,
  row: 7
}));

const letterCells: LetterCell[] = [...saakshi, ...portfolio];

export function CrosswordGateway() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const root = useRef<HTMLElement>(null);
  const unlocked = revealed.size === letterCells.length;

  const cells = useMemo(() => letterCells, []);

  const reveal = (id: string) => {
    setRevealed((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  };

  return (
    <section ref={root} className="min-h-screen bg-ink px-4 py-24 text-bone md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-archive text-white/42">Interactive gateway</p>
            <h2 className="mt-3 font-editorial text-[clamp(3rem,9vw,8rem)] uppercase leading-none">Open Archive</h2>
          </div>
        </div>

        <div data-cursor="archive" className="relative overflow-hidden border border-white/12 bg-black shadow-soft">
          <div className="relative aspect-[2048/1536]">
            <Image
              src={assets.crossword}
              alt="Saakshi Sunil portfolio crossword gateway"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover"
            />

            <div className="absolute inset-0 grid grid-cols-16 grid-rows-12">
              {cells.map((cell) => (
                <button
                  key={cell.id}
                  aria-label={`Reveal ${cell.letter}`}
                  className="crossword-letter-cell grid place-items-center border-[2px] border-black bg-[#6f8f98] font-sans text-[clamp(2rem,5.4vw,5.9rem)] font-medium uppercase leading-none text-black"
                  style={{
                    gridColumn: `${cell.col} / span 1`,
                    gridRow: `${cell.row} / span 1`
                  }}
                  onMouseEnter={() => reveal(cell.id)}
                  onFocus={() => reveal(cell.id)}
                >
                  <span className={`transition-opacity duration-500 ${revealed.has(cell.id) ? "opacity-100" : "opacity-0"}`}>
                    {cell.letter}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#portfolio"
            className={`archive-link font-sans text-xs uppercase tracking-archive transition duration-700 ${
              unlocked ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            Open Archive
          </a>
        </div>
      </div>
    </section>
  );
}
