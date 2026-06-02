"use client";

import { useEffect, useState } from "react";

export function PdfCoverImage({ pdf, title }: { pdf: string; title: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function renderCover() {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
      const document = await pdfjs.getDocument(pdf).promise;
      const page = await document.getPage(1);
      const viewport = page.getViewport({ scale: 0.7 });
      const canvas = window.document.createElement("canvas");
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      context.fillStyle = "#f6f3ef";
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: context as CanvasRenderingContext2D, viewport }).promise;

      if (!cancelled) setSrc(canvas.toDataURL("image/jpeg", 0.88));
    }

    renderCover().catch(() => {
      if (!cancelled) setSrc("");
    });

    return () => {
      cancelled = true;
    };
  }, [pdf]);

  if (!src) {
    return <span className="grid h-full w-full place-items-center bg-[#211d19] font-editorial text-sm italic text-bone/55">{title}</span>;
  }

  return <img src={src} alt={`${title} cover`} className="h-full w-full object-cover" />;
}
