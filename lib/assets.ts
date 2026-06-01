export const assets = {
  chrome: "/assets/chrome-reference.jfif",
  crossword: "/assets/crossword.png",
  tableReference: "/assets/archive-table-reference.jfif",
  portrait: "/assets/about-portrait.jpg",
  magazinePdf: "/assets/magazine-issue-01.pdf",
  thesisPdf: "/assets/remembrance-archived-thesis.pdf"
};

export type ArchiveKind = "thesis" | "magazine";

export const archiveDocuments = {
  thesis: {
    title: "REMEMBRANCE ARCHIVED",
    label: "Thesis book",
    pdf: assets.thesisPdf
  },
  magazine: {
    title: "MAGAZINE ISSUE 01",
    label: "Magazine",
    pdf: assets.magazinePdf
  }
} satisfies Record<ArchiveKind, { title: string; label: string; pdf: string }>;
