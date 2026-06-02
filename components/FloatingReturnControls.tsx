"use client";

type FloatingReturnControlsProps = {
  onHome?: () => void;
  onArchive?: () => void;
};

export function FloatingReturnControls({ onHome, onArchive }: FloatingReturnControlsProps) {
  const goHome = () => {
    onHome?.();
    window.setTimeout(() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  const goArchive = () => {
    onArchive?.();
    window.setTimeout(() => document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  return (
    <nav className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 gap-2 rounded-full border border-ink/10 bg-[rgba(246,243,239,0.92)] px-2 py-2 shadow-[0_18px_45px_rgba(26,23,20,0.14)] backdrop-blur-md">
      <button
        data-cursor-label="RETURN"
        className="rounded-full border border-ink/10 px-4 py-2 font-display text-[0.48rem] uppercase tracking-[0.22em] text-ink/60 transition hover:border-ink/25 hover:text-ink"
        onClick={goHome}
      >
        Return to Home
      </button>
      <button
        data-cursor-label="RETURN"
        className="rounded-full border border-ink/10 px-4 py-2 font-display text-[0.48rem] uppercase tracking-[0.22em] text-ink/60 transition hover:border-ink/25 hover:text-ink"
        onClick={goArchive}
      >
        Return to Archive
      </button>
    </nav>
  );
}
