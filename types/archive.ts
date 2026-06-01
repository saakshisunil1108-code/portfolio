import type { ArchiveKind } from "@/lib/assets";

export type ArchiveSelection = {
  kind: ArchiveKind;
  title: string;
  pdf: string;
};
