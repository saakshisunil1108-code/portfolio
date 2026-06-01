"use client";

import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ArchiveSelection } from "@/types/archive";

const HTMLFlipBook = dynamic(async () => (await import("react-pageflip")).default, { ssr: false });

type PageImage = {
  page: number;
  src: string;
};

export function PdfFlipbook({
  selection,
  onClose
}: {
  selection: ArchiveSelection | null;
  onClose: () => void;
}) {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!selection) return;
      setLoading(true);
      setPages([]);

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();

      const pdf = await pdfjs.getDocument(selection.pdf).promise;
      const rendered: PageImage[] = [];

      for (let index = 1; index <= pdf.numPages; index += 1) {
        const page = await pdf.getPage(index);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        rendered.push({ page: index, src: canvas.toDataURL("image/jpeg", 0.86) });
      }

      if (!cancelled) {
        setPages(rendered);
        setLoading(false);
      }
    }

    loadPdf().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selection]);

  const bookSize = useMemo(() => ({ width: 430 * zoom, height: 610 * zoom }), [zoom]);

  if (!selection) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/95 text-bone">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-8">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-archive text-white/45">Archive document</p>
            <h3 className="font-editorial text-2xl uppercase md:text-4xl">{selection.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Previous page" className="p-3" onClick={() => bookRef.current?.pageFlip()?.flipPrev()}>
              <ChevronLeft size={20} />
            </button>
            <button aria-label="Next page" className="p-3" onClick={() => bookRef.current?.pageFlip()?.flipNext()}>
              <ChevronRight size={20} />
            </button>
            <button aria-label="Zoom out" className="p-3" onClick={() => setZoom((value) => Math.max(0.72, value - 0.12))}>
              <ZoomOut size={18} />
            </button>
            <button aria-label="Zoom in" className="p-3" onClick={() => setZoom((value) => Math.min(1.35, value + 0.12))}>
              <ZoomIn size={18} />
            </button>
            <button aria-label="Fullscreen" className="p-3" onClick={() => document.documentElement.requestFullscreen?.()}>
              <Maximize2 size={18} />
            </button>
            <button aria-label="Close" className="p-3" onClick={onClose}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="grid flex-1 place-items-center overflow-auto px-4 py-8">
          {loading ? (
            <p className="font-sans text-xs uppercase tracking-archive text-white/55">Loading archive</p>
          ) : (
            <HTMLFlipBook
              ref={bookRef}
              width={bookSize.width}
              height={bookSize.height}
              size="stretch"
              minWidth={280}
              maxWidth={bookSize.width}
              minHeight={390}
              maxHeight={bookSize.height}
              drawShadow
              showCover
              mobileScrollSupport
              className="shadow-soft"
              style={{}}
              startPage={0}
              flippingTime={900}
              usePortrait
              startZIndex={0}
              autoSize
              maxShadowOpacity={0.32}
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
            >
              {pages.map((page) => (
                <div key={page.page} className="grid bg-bone p-3 text-ink">
                  <img
                    src={page.src}
                    alt={`${selection.title} page ${page.page}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </div>
      </div>
    </div>
  );
}
