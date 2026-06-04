"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PdfFlipbook } from "@/components/PdfFlipbook";
import { PdfCoverImage } from "@/components/PdfCoverImage";
import { registerGsap } from "@/animations/registerGsap";
import { archiveDocuments, assets, type ArchiveKind } from "@/lib/assets";
import type { ArchiveSelection } from "@/types/archive";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function FinalCollectionFeature({ onOpen, settled }: { onOpen: (kind: ArchiveKind) => void; settled: boolean }) {
  const document = archiveDocuments.finalCollection;

  return (
    <div className={`final-collection-feature ${settled ? "is-settled" : ""}`}>
      <button data-cursor-label="ENTER" className="final-collection-object" onClick={() => onOpen("finalCollection")} title="Final Collection">
        <span className="final-collection-cover">
          <PdfCoverImage pdf={document.pdf} title="Final Collection" />
        </span>
      </button>
      <span className="acrylic-stand" aria-hidden />
      <div className="final-collection-caption mt-7 text-center">
        <p className="font-display text-[0.5rem] uppercase tracking-[0.3em] text-ink/45">Final Collection</p>
      </div>
    </div>
  );
}

function JournalBook({ onOpen }: { onOpen: (kind: ArchiveKind) => void }) {
  return (
    <button data-cursor-label="READ" className="t-obj left-[7%] top-[20%] w-[18%]" style={{ transform: "rotate(-4deg)" }} onClick={() => onOpen("journal")} title="Journal - Saakshi Sunil">
      <svg viewBox="0 0 118 152" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="102" height="144" rx="2" fill="rgba(26,23,20,0.14)" />
        <rect x="5" y="3" width="104" height="142" rx="2" fill="#eee8df" stroke="rgba(26,23,20,0.16)" />
        <path d="M100 4 L109 13 L109 145 L100 145 Z" fill="rgba(26,23,20,0.06)" />
        <rect x="5" y="3" width="16" height="142" fill="rgba(170,163,153,0.24)" />
        {Array.from({ length: 11 }, (_, index) => (
          <g key={index} transform={`translate(0 ${15 + index * 11})`}>
            <ellipse cx="18" cy="0" rx="5" ry="3" fill="none" stroke="#2a2520" strokeWidth="1.2" />
            <line x1="7" y1="-1.5" x2="18" y2="-1.5" stroke="#2a2520" strokeWidth="1" />
          </g>
        ))}
        <text x="63" y="28" textAnchor="middle" fill="rgba(26,23,20,0.38)" fontSize="4.4" fontFamily="Cinzel, serif" letterSpacing="1.4">PROCESS JOURNAL</text>
        <text x="63" y="74" textAnchor="middle" fill="rgba(26,23,20,0.62)" fontSize="10" fontFamily="Cormorant Garamond, serif" fontStyle="italic">Saakshi Sunil</text>
        <path d="M38 95 C49 88 58 102 71 92 C80 85 88 91 94 86" fill="none" stroke="rgba(26,23,20,0.22)" strokeWidth="1.2" />
        {[112, 121, 130].map((y) => (
          <line key={y} x1="35" y1={y} x2="94" y2={y} stroke="rgba(26,23,20,0.10)" />
        ))}
      </svg>
    </button>
  );
}

function Magazine({ onOpen }: { onOpen: (kind: ArchiveKind) => void }) {
  return (
    <button data-cursor-label="READ" className="t-obj right-[10%] top-[10%] w-[16%]" style={{ transform: "rotate(3deg)" }} onClick={() => onOpen("magazine")} title="Magazine Issue 01">
      <svg viewBox="0 0 105 148" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="5" width="104" height="146" rx="1" fill="rgba(26,23,20,0.11)" />
        <rect width="48" height="148" rx="1" fill="#c0241c" />
        <rect x="48" width="57" height="148" rx="1" fill="#111118" />
        <path d="M98 0 L105 8 L105 148 L98 148 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M6 12 C18 9 31 11 43 9" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
        <text x="24" y="94" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="26" fontFamily="Cormorant Garamond, serif" fontStyle="italic">01</text>
        <text x="24" y="128" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="4" fontFamily="Cinzel, serif" letterSpacing="1">ISSUE</text>
        <text x="77" y="28" textAnchor="middle" fill="rgba(200,197,190,0.35)" fontSize="10" fontFamily="Cormorant Garamond, serif" fontStyle="italic">dirty</text>
        <rect x="52" y="38" width="49" height="62" fill="rgba(0,0,0,0.35)" />
      </svg>
    </button>
  );
}

function ResearchPaper({
  kind,
  label,
  shortLabel,
  className,
  onOpen
}: {
  kind: ArchiveKind;
  label: string;
  shortLabel: string;
  className: string;
  onOpen: (kind: ArchiveKind) => void;
}) {
  const labelLines = shortLabel.split("\n");

  return (
    <button data-cursor-label="READ" className={`t-obj ${className}`} onClick={() => onOpen(kind)} title={label}>
      <svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="7" width="82" height="108" rx="1" fill="#e5dfd5" stroke="rgba(26,23,20,0.10)" strokeWidth="0.5" />
        <rect x="2" y="3" width="82" height="108" rx="1" fill="#eee8df" stroke="rgba(26,23,20,0.12)" strokeWidth="0.5" />
        <rect width="82" height="108" rx="1" fill="#f7f2ea" stroke="rgba(26,23,20,0.15)" strokeWidth="0.5" />
        <text x="41" y="16" textAnchor="middle" fill="rgba(26,23,20,0.28)" fontSize="4" fontFamily="Cinzel, serif" letterSpacing="1">RESEARCH</text>
        <text x="41" y="35" textAnchor="middle" fill="rgba(26,23,20,0.5)" fontSize="5.4" fontFamily="Cinzel, serif" letterSpacing="0.7">
          {labelLines.map((line, index) => (
            <tspan key={`${line}-${index}`} x="41" dy={index === 0 ? 0 : 8}>{line}</tspan>
          ))}
        </text>
        <line x1="19" y1="62" x2="63" y2="62" stroke="rgba(26,23,20,0.16)" strokeWidth="0.5" />
        {[76, 84, 92].map((y) => (
          <line key={y} x1="14" y1={y} x2="68" y2={y} stroke="rgba(26,23,20,0.10)" strokeWidth="0.5" />
        ))}
      </svg>
    </button>
  );
}

function BagSnapshot() {
  return (
    <span className="polaroid-image">
      <img
        src={assets.bagSnapshot}
        alt="Bag archival snapshot"
        onError={() => {
          console.warn("Bag image missing at public/assets/bag.png");
        }}
      />
    </span>
  );
}

function StudioObject({ className, children, title }: { className: string; children: ReactNode; title?: string }) {
  return (
    <div data-cursor-label={title ? "VIEW" : undefined} className={`t-obj ${className}`} title={title}>
      {children}
    </div>
  );
}

function ReadingLamp({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button data-cursor-label="READ" className={`archive-lamp ${active ? "is-on" : ""}`} onClick={onToggle} title="Toggle reading mode">
      <svg viewBox="0 0 170 360" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="74" cy="342" rx="54" ry="13" fill="rgba(26,23,20,0.16)" />
        <ellipse cx="74" cy="333" rx="42" ry="12" fill="#171819" stroke="rgba(255,255,255,0.16)" />
        <path d="M74 103 L74 329" stroke="#202223" strokeWidth="8" strokeLinecap="round" />
        <path d="M84 106 L129 66" stroke="#2f3233" strokeWidth="7" strokeLinecap="round" />
        <circle cx="80" cy="104" r="13" fill="#171819" stroke="rgba(255,255,255,0.18)" />
        <path d="M122 35 C145 38 160 54 160 74 C160 95 139 110 104 108 C101 78 105 52 122 35 Z" fill="#1c1e1f" stroke="rgba(255,255,255,0.18)" />
        <path d="M105 101 C122 108 148 103 158 80 C154 111 124 124 103 108 Z" fill={active ? "rgba(255,214,143,0.74)" : "rgba(255,255,255,0.12)"} />
        <path d="M126 40 C139 45 151 55 154 70" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" />
        <path d="M112 108 C86 156 70 227 75 326" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
      </svg>
      <span className="lamp-instruction">
        Click Lamp
        <br />
        For Reading Mode
      </span>
    </button>
  );
}

export function ArchiveTable() {
  const [selection, setSelection] = useState<ArchiveSelection | null>(null);
  const [finalCollectionViewed, setFinalCollectionViewed] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const root = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const open = (kind: ArchiveKind) => {
    const document = archiveDocuments[kind];
    setSelection({ kind, title: document.title, pdf: document.pdf });
  };

  const openPortfolio = () => {
    window.dispatchEvent(new CustomEvent("portfolio:open"));
    window.setTimeout(() => document.getElementById("portfolioViewer")?.scrollIntoView({ behavior: "smooth" }), 40);
  };

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    const { gsap } = registerGsap();
    const context = gsap.context(() => {
      gsap.to(".t-obj", {
        y: (index) => (index % 3 === 0 ? -18 : index % 3 === 1 ? 12 : -8),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, element);
    return () => context.revert();
  }, [reduced]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--lamp-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      element.style.setProperty("--lamp-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };

    element.addEventListener("mousemove", move);
    return () => element.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/cafe-music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }
    const audio = audioRef.current;
    if (fadeRef.current) window.clearInterval(fadeRef.current);

    if (readingMode) {
      audio.currentTime = audio.currentTime || 0;
      void audio.play();
      fadeRef.current = window.setInterval(() => {
        audio.volume = Math.min(0.18, audio.volume + 0.012);
        if (audio.volume >= 0.18 && fadeRef.current) {
          window.clearInterval(fadeRef.current);
          fadeRef.current = null;
        }
      }, 100);
    } else {
      fadeRef.current = window.setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.014);
        if (audio.volume <= 0.001) {
          audio.pause();
          audio.volume = 0;
          if (fadeRef.current) {
            window.clearInterval(fadeRef.current);
            fadeRef.current = null;
          }
        }
      }, 100);
    }

    return () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current);
    };
  }, [readingMode]);

  return (
    <section id="archive" ref={root} className={`archive-reading-surface paper-section flex min-h-screen flex-col items-center px-5 py-24 md:px-16 ${readingMode ? "reading-mode" : ""}`}>
      <div className="reading-mode-overlay" aria-hidden />
      <div className="mb-20 text-center">
        <p className="section-heading-label mb-4">03 - Archive Table</p>
        <h2 className="font-editorial text-[clamp(3rem,5vw,4.5rem)] italic leading-none text-ink">Objects arranged for reading.</h2>
      </div>

      <div className="grid w-full max-w-6xl gap-16 md:grid-cols-[1fr_320px]">
        <div className="relative w-full">
          <FinalCollectionFeature onOpen={open} settled={finalCollectionViewed} />
          <svg className="pointer-events-none block h-auto w-full" viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.40)" />
                <stop offset="38%" stopColor="rgba(205,214,214,0.22)" />
                <stop offset="64%" stopColor="rgba(255,255,255,0.30)" />
                <stop offset="100%" stopColor="rgba(165,178,178,0.14)" />
              </linearGradient>
              <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
                <stop offset="50%" stopColor="rgba(182,196,196,0.26)" />
                <stop offset="100%" stopColor="rgba(90,105,105,0.16)" />
              </linearGradient>
              <linearGradient id="glassRim" x1="65" y1="92" x2="670" y2="458">
                <stop offset="0%" stopColor="rgba(255,255,255,0.78)" />
                <stop offset="34%" stopColor="rgba(255,255,255,0.14)" />
                <stop offset="70%" stopColor="rgba(130,148,148,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.42)" />
              </linearGradient>
              <linearGradient id="glassGlint" x1="125" y1="110" x2="590" y2="390">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="28%" stopColor="rgba(255,255,255,0.38)" />
                <stop offset="54%" stopColor="rgba(255,255,255,0.10)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="22" stdDeviation="24" floodColor="rgba(26,23,20,0.13)" />
              </filter>
              <filter id="glassBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <path d="M104 230 Q75 126 202 96 Q342 62 498 83 Q630 100 656 202 Q684 310 646 386 Q606 468 490 480 Q332 497 190 468 Q83 446 66 356 Q50 282 104 230 Z" fill="rgba(26,23,20,0.035)" filter="url(#glassBlur)" />
            <path d="M90 200 Q65 105 195 78 Q340 45 495 65 Q640 80 668 195 Q695 310 655 395 Q615 475 490 488 Q330 505 185 478 Q68 452 55 358 Q38 268 90 200 Z" fill="url(#tg1)" stroke="url(#tg2)" strokeWidth="1.2" filter="url(#softShadow)" opacity="0.92" />
            <path d="M90 200 Q65 105 195 78 Q340 45 495 65 Q640 80 668 195 Q695 310 655 395 Q615 475 490 488 Q330 505 185 478 Q68 452 55 358 Q38 268 90 200 Z" fill="none" stroke="url(#glassRim)" strokeWidth="4.8" opacity="0.52" />
            <path d="M102 205 Q79 119 205 92 Q340 61 492 80 Q623 96 652 196" stroke="rgba(255,255,255,0.54)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M85 357 Q148 435 300 455 Q456 474 604 420" stroke="rgba(93,112,112,0.12)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M128 148 Q240 108 380 118 Q430 122 460 132" stroke="rgba(255,255,255,0.42)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M160 135 Q290 100 420 112" stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M415 92 Q522 126 575 206 Q596 238 596 276" stroke="rgba(255,255,255,0.18)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            <path d="M118 244 Q220 198 354 206 Q476 212 583 252" stroke="url(#glassGlint)" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.72" />
            <path d="M142 294 Q272 262 412 278 Q515 290 626 345" stroke="rgba(255,255,255,0.18)" strokeWidth="0.85" fill="none" strokeLinecap="round" />
            <path d="M235 108 Q355 86 506 110" stroke="rgba(255,255,255,0.26)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <ellipse cx="418" cy="178" rx="88" ry="16" fill="rgba(255,255,255,0.055)" transform="rotate(9 418 178)" />
            <ellipse cx="190" cy="510" rx="62" ry="8" fill="rgba(26,23,20,0.07)" />
            <ellipse cx="510" cy="510" rx="62" ry="8" fill="rgba(26,23,20,0.07)" />
          </svg>

          <div className="archive-table-objects absolute inset-0">
            <JournalBook onOpen={open} />
            <Magazine onOpen={open} />

            <ResearchPaper kind="research01" label={archiveDocuments.research01.title} shortLabel={"Paper 01\nY2K Redux"} className="left-[36%] top-[54%] w-[13%]" onOpen={open} />
            <ResearchPaper kind="research02" label={archiveDocuments.research02.title} shortLabel={"Paper 02\nBreaking the Mold"} className="left-[43%] top-[50%] w-[13%]" onOpen={open} />
            <ResearchPaper kind="research03" label={archiveDocuments.research03.title} shortLabel={"Paper 03\nSubcultural Influences"} className="left-[50%] top-[56%] w-[13%]" onOpen={open} />

            <StudioObject className="right-[22%] top-[42%] w-[11%]">
              <span className="polaroid-frame">
                <BagSnapshot />
                <span className="polaroid-caption">archive</span>
              </span>
            </StudioObject>

            <StudioObject className="right-[16%] top-[58%] w-[7%]">
              <svg viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="14" width="30" height="34" rx="3" fill="#2a2520" stroke="rgba(200,197,190,0.2)" strokeWidth="0.8" /><path d="M34 21 Q44 21 44 30 Q44 39 34 39" stroke="rgba(200,197,190,0.18)" strokeWidth="1.5" fill="none" /><ellipse cx="19" cy="14" rx="15" ry="4" fill="#1c1814" /></svg>
            </StudioObject>

            <StudioObject className="bottom-[18%] left-[22%] w-[14%]">
              <svg viewBox="0 0 12 100" xmlns="http://www.w3.org/2000/svg"><rect x="2" width="8" height="80" fill="#e8d585" /><polygon points="2,80 10,80 6,94" fill="#c4a070" /><polygon points="4.5,90 7.5,90 6,96" fill="#2a2520" /><rect x="2" width="8" height="7" fill="#e07060" /><rect x="2" y="7" width="8" height="3.5" fill="#b0b0b0" /></svg>
            </StudioObject>

            <StudioObject className="bottom-[22%] right-[6%] w-[9%]">
              <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="80" rx="1" fill="#3a404a" stroke="rgba(200,197,190,0.12)" strokeWidth="0.5" />{[10, 20, 30].map((v) => <line key={`h${v}`} x1="0" y1={v} x2="60" y2={v} stroke="rgba(200,197,190,0.07)" strokeWidth="0.5" />)}{[10, 20, 30].map((v) => <line key={`v${v}`} x1={v} y1="0" x2={v} y2="80" stroke="rgba(200,197,190,0.07)" strokeWidth="0.5" />)}</svg>
            </StudioObject>
          </div>
          <ReadingLamp active={readingMode} onToggle={() => setReadingMode((value) => !value)} />
        </div>

        <div className="border-l border-ink/10 pl-8 max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-8">
          <div className="section-heading-label mb-6 border-b border-ink/10 pb-3">Archive Index</div>
          {[
            ["001", "Final Collection", () => open("finalCollection")],
            ["002", "Journal - Saakshi Sunil", () => open("journal")],
            ["003", "Magazine", () => open("magazine")],
            ["004", archiveDocuments.research01.title, () => open("research01")],
            ["005", archiveDocuments.research02.title, () => open("research02")],
            ["006", archiveDocuments.research03.title, () => open("research03")],
            ["007", "Portfolio", openPortfolio]
          ].map(([num, name, action]) => (
            <button key={String(num)} data-cursor-label={name === "Portfolio" ? "ENTER" : "READ"} className="flex w-full items-baseline gap-4 border-b border-ink/10 py-3 text-left transition hover:text-ink" onClick={action as (() => void) | undefined}>
              <span className="min-w-8 font-display text-[0.45rem] tracking-[0.1em] text-ink/45">{num as string}</span>
              <span className="whitespace-pre-line font-editorial text-base italic text-ink/70">{name as string}</span>
            </button>
          ))}
        </div>
      </div>

      <PdfFlipbook
        selection={selection}
        onClose={() => {
          if (selection?.kind === "finalCollection") setFinalCollectionViewed(true);
          setSelection(null);
        }}
      />
    </section>
  );
}
