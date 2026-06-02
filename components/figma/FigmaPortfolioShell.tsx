"use client";

import { useEffect, useState } from "react";
import { FloatingReturnControls } from "@/components/FloatingReturnControls";

const PROTOTYPE_URL =
  "https://www.figma.com/proto/crLbKhRZUiZKzwC2GYoEJ7/Saakshi-Sunil---Portfolio--Copy-?node-id=20-257&t=M6S19ivatMqQp5s8-1";
const FIGMA_URL = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(PROTOTYPE_URL)}`;

export function FigmaPortfolioShell() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const openViewer = () => {
      setOpen(true);
      setLoaded(true);
      setShowFallback(false);
      window.setTimeout(() => setShowFallback(true), 3500);
    };
    window.addEventListener("portfolio:open", openViewer);
    return () => window.removeEventListener("portfolio:open", openViewer);
  }, []);

  if (!open) return <section id="portfolioViewer" className="hidden" aria-hidden />;

  const returnHome = () => {
    setOpen(false);
    window.setTimeout(() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }), 40);
  };

  return (
    <section id="portfolioViewer" className="figma-viewer-shell paper-section flex min-h-screen flex-col">
      <FloatingReturnControls onHome={() => setOpen(false)} onArchive={() => setOpen(false)} />
      <header className="flex items-center justify-between border-b border-ink/10 bg-[var(--paper)] px-6 py-5 md:px-14">
        <div>
          <p className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-ink">Portfolio Viewer</p>
          <p className="mt-1 font-editorial text-sm italic text-ink/45">Figma prototype reference</p>
        </div>
        <button
          data-cursor-label="RETURN"
          className="border border-ink/15 px-6 py-3 font-display text-[0.52rem] uppercase tracking-[0.22em] text-ink/55 transition hover:border-ink hover:text-ink"
          onClick={returnHome}
        >
          Return to Home
        </button>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-10">
        <div className="min-h-[80vh] flex-1 border border-ink/10 bg-[var(--paper-dark)]">
          {loaded && (
            <iframe
              src={FIGMA_URL}
              title="Saakshi Sunil portfolio prototype"
              className="block min-h-[80vh] w-full border-0"
              allowFullScreen
              onLoad={() => setShowFallback(true)}
              onError={() => setShowFallback(true)}
            />
          )}
        </div>
        {showFallback && (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-ink/10 bg-[var(--paper-dark)] px-5 py-4">
            <p className="font-editorial text-sm italic text-ink/50">If the embedded viewer does not load, open the prototype directly.</p>
            <a
              data-cursor-label="OPEN"
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noreferrer"
              className="border border-ink px-6 py-3 font-display text-[0.52rem] uppercase tracking-[0.22em] text-ink transition hover:bg-ink hover:text-bone"
            >
              Open Interactive Portfolio
            </a>
          </div>
        )}
        <div className="flex justify-between px-1 font-display text-[0.45rem] uppercase tracking-[0.2em] text-ink/45">
          <span>Native rebuild reference</span>
          <span>Scroll / interact</span>
        </div>
      </div>
    </section>
  );
}
