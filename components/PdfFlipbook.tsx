"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { ArchiveSelection } from "@/types/archive";

const HTMLFlipBook = dynamic(async () => (await import("react-pageflip")).default, { ssr: false });

type PageImage = {
  page: number;
  src: string;
  width: number;
  height: number;
};

const flipbookPageCache = new Map<string, PageImage[]>();
const flipbookRenderCache = new Map<string, Promise<PageImage[]>>();

const createJournalCover = (): PageImage => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });
  canvas.width = 900;
  canvas.height = 1200;
  if (context) {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#d8d6d0");
    gradient.addColorStop(0.32, "#f4f2ed");
    gradient.addColorStop(0.56, "#a7aaa7");
    gradient.addColorStop(0.78, "#ecebe6");
    gradient.addColorStop(1, "#8d918f");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.32;
    for (let i = 0; i < 46; i += 1) {
      context.beginPath();
      context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.strokeStyle = i % 2 ? "#ffffff" : "#2a2520";
      context.lineWidth = i % 2 ? 1.5 : 0.6;
      context.stroke();
    }
    context.globalAlpha = 1;

    context.fillStyle = "rgba(26,23,20,0.82)";
    context.font = "34px serif";
    context.letterSpacing = "3px";
    context.textAlign = "center";
    context.fillText("WORK IN PROGRESS", canvas.width / 2, 515);
    context.fillText("JOURNAL", canvas.width / 2, 565);
    context.font = "italic 42px serif";
    context.fillText("Saakshi Sunil", canvas.width / 2, 660);
    context.strokeStyle = "rgba(26,23,20,0.35)";
    context.lineWidth = 2;
    context.strokeRect(62, 62, canvas.width - 124, canvas.height - 124);
  }

  return {
    page: 0,
    src: canvas.toDataURL("image/jpeg", 0.9),
    width: canvas.width,
    height: canvas.height
  };
};

const splitSpread = (canvas: HTMLCanvasElement, pageNumber: number): PageImage[] => {
  const halfWidth = Math.floor(canvas.width / 2);
  return [0, 1].map((side) => {
    const pageCanvas = document.createElement("canvas");
    const context = pageCanvas.getContext("2d", { alpha: false });
    pageCanvas.width = halfWidth;
    pageCanvas.height = canvas.height;
    if (context) {
      context.drawImage(canvas, side * halfWidth, 0, halfWidth, canvas.height, 0, 0, halfWidth, canvas.height);
    }
    return {
      page: pageNumber * 2 - (side === 0 ? 1 : 0),
      src: pageCanvas.toDataURL("image/jpeg", 0.9),
      width: pageCanvas.width,
      height: pageCanvas.height
    };
  });
};

export function PdfFlipbook({
  selection,
  onClose
}: {
  selection: ArchiveSelection | null;
  onClose: () => void;
}) {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const bookRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selection) return;
    let cancelled = false;
    const selectedDoc = selection;

    async function renderPdf() {
      setPages([]);
      setPageIndex(0);
      setError("");
      setLoading(true);

      const cacheKey = `${selectedDoc.kind}:${selectedDoc.pdf}`;
      const cachedPages = flipbookPageCache.get(cacheKey);
      if (cachedPages) {
        setPages(cachedPages);
        setLoading(false);
        return;
      }

      let renderJob = flipbookRenderCache.get(cacheKey);

      if (!renderJob) {
        renderJob = (async () => {
          const exists = await fetch(selectedDoc.pdf, { method: "HEAD" });
          if (!exists.ok) throw new Error("missing");

          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
          const pdf = await pdfjs.getDocument(selectedDoc.pdf).promise;
          const renderedPages: PageImage[] = [];
          const splitMagazineSpreads = selectedDoc.kind === "magazine";
          const isJournal = selectedDoc.kind === "journal";
          let magazineBackCover: PageImage | null = null;

          if (isJournal) renderedPages.push(createJournalCover());

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: window.innerWidth < 768 ? 0.9 : 1.08 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d", { alpha: false });
            if (!context) continue;

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            context.fillStyle = "#f6f3ef";
            context.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvas, canvasContext: context as CanvasRenderingContext2D, viewport }).promise;

            if (splitMagazineSpreads && canvas.width > canvas.height) {
              const halves = splitSpread(canvas, pageNumber);
              if (pageNumber === 1) {
                renderedPages.push(halves[1]);
                magazineBackCover = halves[0];
              } else {
                renderedPages.push(...halves);
              }
            } else {
              renderedPages.push({ page: pageNumber, src: canvas.toDataURL("image/jpeg", 0.9), width: canvas.width, height: canvas.height });
            }
          }

          if (magazineBackCover) renderedPages.push(magazineBackCover);
          flipbookPageCache.set(cacheKey, renderedPages);
          flipbookRenderCache.delete(cacheKey);
          return renderedPages;
        })();
        flipbookRenderCache.set(cacheKey, renderJob);
      }

      const renderedPages = await renderJob;

      if (!cancelled) {
        setPages(renderedPages);
        setLoading(false);
      }
    }

    renderPdf().catch(() => {
      if (cancelled) return;
      setPages([]);
      setLoading(false);
      setError(selectedDoc.kind.startsWith("research") ? "Research Paper PDF not added yet." : `Could not load ${selectedDoc.pdf}.`);
    });

    return () => {
      cancelled = true;
    };
  }, [selection]);

  const moveCursor = (event: MouseEvent<HTMLDivElement>) => {
    setCursor({ x: event.clientX, y: event.clientY, visible: true });
  };

  const hideCursor = () => {
    setCursor((current) => ({ ...current, visible: false }));
  };

  const size = useMemo(() => {
    const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
    const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
    const ratio = pages[0] ? pages[0].width / pages[0].height : 0.72;
    const height = Math.min(660, Math.max(360, viewportHeight * 0.7));
    const width = Math.min(520, Math.max(240, height * ratio, viewportWidth * 0.24));
    return { width, height };
  }, [selection, pages]);

  if (!selection || !mounted) return null;

  const total = pages.length;
  const current = total ? Math.min(pageIndex + 1, total) : 0;

  const previous = () => bookRef.current?.pageFlip()?.flipPrev();
  const next = () => bookRef.current?.pageFlip()?.flipNext();

  return createPortal(
    <div className="flipbookOverlay text-bone" onMouseMove={moveCursor} onMouseLeave={hideCursor}>
      <span className={`flipbookCursor ${cursor.visible ? "is-visible" : ""}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden />
      <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
        <button data-cursor-label="RETURN" className="flipbookControl px-4" onClick={onClose}>
          Return to Archive
        </button>
      </div>
      <div className="absolute right-5 top-5 z-10 flex gap-2">
        <button data-cursor-label="VIEW" aria-label="Previous page" className="flipbookControl" onClick={previous} disabled={!total}>
          <ChevronLeft size={20} />
        </button>
        <button data-cursor-label="VIEW" aria-label="Next page" className="flipbookControl" onClick={next} disabled={!total}>
          <ChevronRight size={20} />
        </button>
        <button data-cursor-label="RETURN" aria-label="Close" className="flipbookControl" onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      <div className="grid h-full w-full place-items-center px-4 py-16">
          {error ? (
            <div className="max-w-md text-center">
              <p className="whitespace-pre-line font-editorial text-4xl">{selection.title}</p>
              <p className="mt-5 font-sans text-xs uppercase leading-6 tracking-archive text-white/55">{error}</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="max-w-lg text-center">
              <p className="whitespace-pre-line font-editorial text-3xl text-white/76">{selection.title}</p>
              <p className="mt-5 font-sans text-xs uppercase tracking-archive text-white/55">Loading flipbook</p>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-4">
              <HTMLFlipBook
                key={selection.pdf}
                ref={bookRef}
                width={size.width}
                height={size.height}
                size="stretch"
                minWidth={260}
                maxWidth={size.width}
                minHeight={360}
                maxHeight={size.height}
                drawShadow
                showCover
                mobileScrollSupport
                className="luxury-flipbook shadow-[0_26px_80px_rgba(0,0,0,0.38)]"
                style={{}}
                startPage={0}
                flippingTime={820}
                usePortrait
                startZIndex={0}
                autoSize
                maxShadowOpacity={0.42}
                clickEventForward
                useMouseEvents
                swipeDistance={24}
                showPageCorners
                disableFlipByClick
                onFlip={(event: { data: number }) => setPageIndex(event.data)}
              >
                {pages.map((page) => (
                  <div key={page.page} className="flipbook-page grid bg-transparent text-ink">
                    <img src={page.src} alt={`${selection.title} page ${page.page}`} className="h-full w-full object-fill" />
                  </div>
                ))}
              </HTMLFlipBook>
              <p className="font-display text-[0.52rem] uppercase tracking-[0.24em] text-white/50">
                Page {current} / {total}
                {loading ? " - rendering" : ""}
              </p>
            </div>
          )}
      </div>
    </div>,
    document.body
  );
}
