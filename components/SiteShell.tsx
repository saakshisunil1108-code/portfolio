"use client";

import { ReactNode } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { useLenis } from "@/hooks/useLenis";

export function SiteShell({ children }: { children: ReactNode }) {
  useLenis();

  return (
    <>
      <CustomCursor />
      <main>{children}</main>
    </>
  );
}
