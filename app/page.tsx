import { ArchiveTable } from "@/sections/ArchiveTable";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { CrosswordGateway } from "@/sections/CrosswordGateway";
import { Hero } from "@/sections/Hero";
import { Portfolio } from "@/sections/Portfolio";
import { SiteShell } from "@/components/SiteShell";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <About />
      <CrosswordGateway />
      <Portfolio />
      <ArchiveTable />
      <Contact />
    </SiteShell>
  );
}
