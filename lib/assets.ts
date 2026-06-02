export const assets = {
  heroVideo: "/assets/updated-hero-video.mp4",
  crossword: "/assets/crossword.png",
  tableReference: "/assets/archive-table-reference.jfif",
  portrait: "/assets/about-portrait.jpg",
  bagSnapshot: "/assets/bag.png",
  magazinePdf: "/assets/magazine-issue-01.pdf",
  journalPdf: "/assets/journal-saakshi-sunil.pdf",
  thesisPdf: "/assets/remembrance-archived-thesis.pdf",
  research01Pdf: "/assets/research-paper-01.pdf",
  research02Pdf: "/assets/research-paper-02.pdf",
  research03Pdf: "/assets/research-paper-03.pdf"
};

export type ArchiveKind = "finalCollection" | "journal" | "magazine" | "research01" | "research02" | "research03";

export const archiveDocuments = {
  finalCollection: {
    title: "REMEMBRANCE ARCHIVED",
    label: "Final collection",
    pdf: assets.thesisPdf,
    available: true
  },
  journal: {
    title: "JOURNAL - SAAKSHI SUNIL",
    label: "Process journal",
    pdf: assets.journalPdf,
    available: true
  },
  magazine: {
    title: "MAGAZINE ISSUE 01",
    label: "Magazine",
    pdf: assets.magazinePdf,
    available: true
  },
  research01: {
    title: "Paper 01\nY2K Redux:\nNostalgia, AI Anxiety and Body Norms",
    label: "Y2K Redux: Nostalgia, AI Anxiety and Body Norms",
    pdf: assets.research01Pdf,
    available: true
  },
  research02: {
    title: "Paper 02\nBreaking the Mold:\nElsa Schiaparelli's Journey Beyond Couture and Gender Boundaries",
    label: "Breaking the Mold: Elsa Schiaparelli's Journey Beyond Couture and Gender Boundaries",
    pdf: assets.research02Pdf,
    available: true
  },
  research03: {
    title: "Paper 03\nSubcultural Influences on Indian Fashion",
    label: "Subcultural Influences on Indian Fashion",
    pdf: assets.research03Pdf,
    available: true
  }
} satisfies Record<ArchiveKind, { title: string; label: string; pdf: string; available: boolean }>;
