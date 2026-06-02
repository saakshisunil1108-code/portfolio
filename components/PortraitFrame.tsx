"use client";

import { useState } from "react";
import { assets } from "@/lib/assets";

export function PortraitFrame() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden border border-ink/10 bg-[var(--paper-dark)]">
      {available ? (
        <img
          src={assets.portrait}
          alt="Saakshi Sunil portrait"
          className="h-full w-full object-cover"
          onError={() => setAvailable(false)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center px-8 text-center font-display text-[0.5rem] uppercase tracking-[0.2em] text-ink/20">
          Portrait pending
        </div>
      )}
    </div>
  );
}
