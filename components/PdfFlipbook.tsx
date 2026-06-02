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

type PageSlot = PageImage | null;

type FlipbookCacheEntry = {
  pages: PageSlot[];
  complete: boolean;
};

const flipbookPageCache = new Map<string, FlipbookCacheEntry>();

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
  const [pages, setPages] = useState<PageSlot[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const bookRef = useRef<any>(null);
  const renderSession = useRef(0);
  const ensureWindowRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selection) return;
    let cancelled = false;
    const sessionId = renderSession.current + 1;
    renderSession.current = sessionId;
    const selectedDoc = selection;

    async function renderPdf() {
      setPages([]);
      setPageIndex(0);
      setError("");
      setLoading(true);

      const cacheKey = `${selectedDoc.kind}:${selectedDoc.pdf}`;
      const cached = flipbookPageCache.get(cacheKey);
      if (cached?.complete) {
        setPages([...cached.pages]);
        setLoading(false);
        ensureWindowRef.current = null;
        return;
      }

      const exists = await fetch(selectedDoc.pdf, { method: "HEAD" });
      if (!exists.ok) throw new Error("missing");

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
      const pdf = await pdfjs.getDocument(selectedDoc.pdf).promise;
      const splitMagazineSpreads = selectedDoc.kind === "magazine";
      const isJournal = selectedDoc.kind === "journal";
      const totalSlots = splitMagazineSpreads ? pdf.numPages * 2 : pdf.numPages + (isJournal ? 1 : 0);
      const cacheEntry: FlipbookCacheEntry = {
        pages: Array.from({ length: totalSlots }, () => null),
        complete: false
      };
      const renderingPages = new Set<number>();
      const renderedPdfPages = new Map<number, PageImage[]>();
      const queuedSlots = new Set<number>();
      const pendingQueue: number[] = [];

      if (isJournal) {
        cacheEntry.pages[0] = createJournalCover();
      }

      flipbookPageCache.set(cacheKey, cacheEntry);

      const publish = () => {
        if (cancelled || renderSession.current !== sessionId) return;
        setPages([...cacheEntry.pages]);
        setLoading(!cacheEntry.complete);
      };

      const renderPdfPage = async (pageNumber: number) => {
        const cachedPage = renderedPdfPages.get(pageNumber);
        if (cachedPage) return cachedPage;
        if (renderingPages.has(pageNumber)) {
          while (renderingPages.has(pageNumber) && !cancelled) {
            await new Promise((resolve) => window.setTimeout(resolve, 40));
          }
          return renderedPdfPages.get(pageNumber) ?? [];
        }

        renderingPages.add(pageNumber);
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: window.innerWidth < 768 ? 0.9 : 1.08 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) {
          renderingPages.delete(pageNumber);
          return [];
        }

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        context.fillStyle = "#f6f3ef";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: context as CanvasRenderingContext2D, viewport }).promise;

        const rendered = splitMagazineSpreads && canvas.width > canvas.height
          ? splitSpread(canvas, pageNumber)
          : [{ page: pageNumber, src: canvas.toDataURL("image/jpeg", 0.9), width: canvas.width, height: canvas.height }];

        renderedPdfPages.set(pageNumber, rendered);
        renderingPages.delete(pageNumber);
        return rendered;
      };

      const fillSlot = async (slotIndex: number) => {
        if (cancelled || renderSession.current !== sessionId || cacheEntry.pages[slotIndex]) return;

        if (isJournal) {
          if (slotIndex === 0) return;
          const rendered = await renderPdfPage(slotIndex);
          if (rendered[0]) cacheEntry.pages[slotIndex] = { ...rendered[0], page: slotIndex + 1 };
        } else if (splitMagazineSpreads) {
          const lastSlot = totalSlots - 1;
          if (slotIndex === 0 || slotIndex === lastSlot) {
            const halves = await renderPdfPage(1);
            if (slotIndex === 0 && halves[1]) cacheEntry.pages[0] = { ...halves[1], page: 1 };
            if (halves[0]) cacheEntry.pages[lastSlot] = { ...halves[0], page: totalSlots };
          } else {
            const sequence = slotIndex - 1;
            const pdfPage = Math.floor(sequence / 2) + 2;
            const side = sequence % 2;
            const halves = await renderPdfPage(pdfPage);
            if (halves[side]) cacheEntry.pages[slotIndex] = { ...halves[side], page: slotIndex + 1 };
            if (halves[1 - side]) {
              const adjacentSlot = side === 0 ? slotIndex + 1 : slotIndex - 1;
              if (adjacentSlot > 0 && adjacentSlot < lastSlot) cacheEntry.pages[adjacentSlot] = { ...halves[1 - side], page: adjacentSlot + 1 };
            }
          }
        } else {
          const rendered = await renderPdfPage(slotIndex + 1);
          if (rendered[0]) cacheEntry.pages[slotIndex] = { ...rendered[0], page: slotIndex + 1 };
        }

        cacheEntry.complete = cacheEntry.pages.every(Boolean);
        publish();
      };

      const queueSlot = (slotIndex: number) => {
        if (slotIndex < 0 || slotIndex >= totalSlots || cacheEntry.pages[slotIndex] || queuedSlots.has(slotIndex)) return;
        queuedSlots.add(slotIndex);
        pendingQueue.push(slotIndex);
      };

      const processQueue = async () => {
        while (!cancelled && renderSession.current === sessionId && pendingQueue.length) {
          const slotIndex = pendingQueue.shift();
          if (slotIndex === undefined) continue;
          queuedSlots.delete(slotIndex);
          await fillSlot(slotIndex);
          await new Promise((resolve) => window.setTimeout(resolve, 20));
        }
      };

      const ensureWindow = (index: number) => {
        [index - 1, index, index + 1, index + 2].forEach(queueSlot);
        void processQueue();
      };

      ensureWindowRef.current = ensureWindow;

      const firstSlots = Array.from(new Set([0, 1].filter((slotIndex) => slotIndex < totalSlots)));
      for (const slotIndex of firstSlots) {
        await fillSlot(slotIndex);
      }

      if (!cancelled) {
        publish();
        ensureWindow(0);
        window.setTimeout(() => {
          for (let slotIndex = 2; slotIndex < totalSlots; slotIndex += 1) queueSlot(slotIndex);
          void processQueue();
        }, 120);
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
    const firstRenderedPage = pages.find(Boolean);
    const ratio = firstRenderedPage ? firstRenderedPage.width / firstRenderedPage.height : 0.72;
    const height = Math.min(660, Math.max(360, viewportHeight * 0.7));
    const width = Math.min(520, Math.max(240, height * ratio, viewportWidth * 0.24));
    return { width, height };
  }, [selection, pages]);

  if (!selection || !mounted) return null;

  const total = pages.length;
  const current = total ? Math.min(pageIndex + 1, total) : 0;

  const previous = () => bookRef.current?.pageFlip()?.flipPrev();
  const next = () => bookRef.current?.pageFlip()?.flipNext();
  const handleFlip = (event: { data: number }) => {
    setPageIndex(event.data);
    ensureWindowRef.current?.(event.data);
  };

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
                onFlip={handleFlip}
              >
                {pages.map((page, index) => (
                  <div key={index} className="flipbook-page grid bg-transparent text-ink">
                    {page ? (
                      <img src={page.src} alt={`${selection.title} page ${index + 1}`} className="h-full w-full object-fill" />
                    ) : (
                      <div className="flipbook-page-loading grid h-full w-full place-items-center">
                        <span>Loading page</span>
                      </div>
                    )}
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
