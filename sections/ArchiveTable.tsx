"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PdfFlipbook } from "@/components/PdfFlipbook";
import { registerGsap } from "@/animations/registerGsap";
import { archiveDocuments, assets, type ArchiveKind } from "@/lib/assets";
import type { ArchiveSelection } from "@/types/archive";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function ArchiveObject({
  kind,
  className,
  variant,
  onOpen
}: {
  kind: ArchiveKind;
  className: string;
  variant: "light" | "dark";
  onOpen: (kind: ArchiveKind) => void;
}) {
  const document = archiveDocuments[kind];

  return (
    <button
      data-cursor="archive"
      className={`archive-object absolute text-left shadow-soft transition duration-500 hover:-translate-y-3 ${className} ${
        variant === "dark" ? "bg-ink text-bone" : "bg-bone text-ink"
      }`}
      onClick={() => onOpen(kind)}
    >
      <div className={`grid aspect-[3/4] place-items-center border p-4 ${variant === "dark" ? "border-white/12 bg-steel" : "border-ink/10 bg-chrome"}`}>
        <span className="font-editorial text-[clamp(1.45rem,3.2vw,4rem)] uppercase leading-none">{document.title}</span>
      </div>
      <div className="p-4">
        <p className="font-sans text-[0.58rem] uppercase tracking-archive opacity-50">{document.label}</p>
        <p className="mt-2 font-sans text-[0.62rem] uppercase tracking-archive opacity-70">Open flipbook</p>
      </div>
    </button>
  );
}

function Polaroid({ className, label }: { className: string; label: string }) {
  return (
    <div className={`archive-object absolute bg-bone p-2 shadow-soft ${className}`}>
      <div className="aspect-square bg-[url('/assets/crossword.png')] bg-cover bg-center grayscale" />
      <p className="mt-3 font-sans text-[0.55rem] uppercase tracking-archive text-ink/50">{label}</p>
    </div>
  );
}

export function ArchiveTable() {
  const [selection, setSelection] = useState<ArchiveSelection | null>(null);
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const open = (kind: ArchiveKind) => {
    const document = archiveDocuments[kind];
    setSelection({ kind, title: document.title, pdf: document.pdf });
  };

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;

    const { gsap } = registerGsap();
    const context = gsap.context(() => {
      gsap.to(".archive-object", {
        y: (index) => (index % 2 === 0 ? -18 : 16),
        rotate: (index) => (index % 2 === 0 ? "+=1.8" : "-=1.4"),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, element);

    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--tx", `${((event.clientX - rect.left) / rect.width - 0.5) * 16}px`);
      element.style.setProperty("--ty", `${((event.clientY - rect.top) / rect.height - 0.5) * 16}px`);
    };

    element.addEventListener("mousemove", move);
    return () => {
      element.removeEventListener("mousemove", move);
      context.revert();
    };
  }, [reduced]);

  return (
    <section ref={root} className="section-padding overflow-hidden bg-bone">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-archive text-ink/45">Archive table</p>
            <h2 className="mt-3 max-w-4xl font-editorial text-[clamp(3rem,8vw,8rem)] uppercase leading-none">
              A floating table of working objects.
            </h2>
          </div>
          <p className="max-w-sm font-sans text-sm leading-7 text-ink/56">
            Thesis, magazine, polaroids, fabric swatches, notes, and small studio objects arranged as a creative archive.
          </p>
        </div>

        <div
          data-cursor="archive"
          className="relative mx-auto aspect-[1.12/1] max-w-6xl md:aspect-[1.55/1]"
          style={{ transform: "translate3d(var(--tx, 0), var(--ty, 0), 0)" }}
        >
          <div className="absolute inset-x-[2%] inset-y-[8%] rounded-[48%_52%_44%_56%] border border-white/70 bg-white/25 shadow-soft backdrop-blur-md" />
          <div className="absolute inset-x-[5%] inset-y-[11%] overflow-hidden rounded-[48%_52%_44%_56%] opacity-45 mix-blend-multiply">
            <Image src={assets.tableReference} alt="Top-down glass coffee table reference" fill className="object-cover" />
          </div>
          <div className="absolute inset-x-[10%] bottom-[8%] h-10 rounded-full bg-ink/12 blur-2xl" />

          <ArchiveObject kind="thesis" variant="light" className="left-[8%] top-[18%] w-[34%] -rotate-7 md:w-[25%]" onOpen={open} />
          <ArchiveObject kind="magazine" variant="dark" className="right-[9%] top-[15%] w-[37%] rotate-5 md:w-[28%]" onOpen={open} />

          <Polaroid className="bottom-[18%] left-[16%] w-[20%] rotate-[-13deg] md:w-[13%]" label="Polaroid / styling" />
          <Polaroid className="right-[34%] top-[9%] w-[16%] rotate-[10deg] md:w-[10%]" label="Lighting test" />

          <div className="archive-object absolute bottom-[20%] right-[17%] w-[22%] rotate-12 border border-ink/15 bg-white/70 p-4 shadow-soft md:w-[15%]">
            <p className="font-editorial text-2xl uppercase leading-none">Research notes</p>
            <div className="mt-5 space-y-2">
              <div className="h-px bg-ink/25" />
              <div className="h-px bg-ink/20" />
              <div className="h-px bg-ink/15" />
            </div>
          </div>

          <div className="archive-object absolute bottom-[11%] left-[43%] flex w-[24%] -rotate-6 gap-1 md:w-[16%]">
            <span className="h-16 flex-1 bg-[#d8d1c3]" />
            <span className="h-16 flex-1 bg-[#8f9292]" />
            <span className="h-16 flex-1 bg-[#1a1a1a]" />
            <span className="h-16 flex-1 bg-[#b4a597]" />
          </div>

          <div className="archive-object absolute right-[24%] top-[44%] grid h-[12%] w-[12%] place-items-center rounded-full border border-ink/15 bg-bone/70 shadow-soft">
            <div className="h-[56%] w-[56%] rounded-full border border-ink/20 bg-white/70" />
          </div>
        </div>
      </div>
      <PdfFlipbook selection={selection} onClose={() => setSelection(null)} />
    </section>
  );
}
