"use client";

import { ReactNode } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { SiteNav } from "@/components/SiteNav";
import { useLenis } from "@/hooks/useLenis";

export function SiteShell({ children }: { children: ReactNode }) {
  useLenis();

  return (
    <>
      <CustomCursor />
      <SiteNav />
      <main>{children}</main>
    </>
  );
}
