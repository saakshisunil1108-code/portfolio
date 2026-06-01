import type { ReactNode } from "react";

export type FigmaScreen = {
  id: string;
  name: string;
  component: ReactNode;
};

export const figmaScreens: FigmaScreen[] = [];
