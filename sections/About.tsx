import Image from "next/image";
import { SectionLabel } from "@/components/SectionLabel";
import { assets } from "@/lib/assets";

export function About() {
  return (
    <section className="section-padding bg-bone">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_.82fr] md:gap-20">
        <div>
          <SectionLabel>About</SectionLabel>
          <p className="max-w-3xl font-editorial text-[clamp(2.2rem,5.7vw,6.2rem)] leading-[0.95] text-balance">
            I’m Saakshi Sunil, a fashion designer, visual storyteller, and creative thinker driven by experimentation and narrative.
          </p>
          <p className="mt-10 max-w-2xl font-sans text-base leading-8 text-ink/64 md:text-lg">
            My practice spans fashion, image-making, styling, photography, and art direction, exploring how ideas can be translated into compelling visual experiences. I’m particularly drawn to strong concepts, unconventional processes, and creating work that balances emotion, research, and innovation through thoughtful design and creative visualization.
          </p>
          <div className="mt-12 flex flex-wrap gap-3 font-sans text-xs uppercase tracking-archive text-ink/70">
            <span>Fashion Designer</span>
            <span>Visual Storyteller</span>
            <span>Art Direction</span>
          </div>
        </div>
        <div className="md:pt-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
            <Image src={assets.chrome} alt="Chrome material study" fill className="object-cover" />
            <div className="absolute inset-0 bg-bone/15 mix-blend-screen" />
            <p className="absolute bottom-6 left-6 max-w-[12rem] font-sans text-[0.62rem] uppercase leading-5 tracking-archive text-ink/55">
              Portrait slot prepared for about-portrait.jpg
            </p>
          </div>
          <div className="mt-5 flex items-end gap-4 border-t border-ink/15 pt-5">
            <div className="grid aspect-[3/4] w-20 place-items-center bg-ink p-2 text-bone">
              <span className="font-editorial text-sm uppercase leading-none">Issue 01</span>
            </div>
            <p className="max-w-xs font-sans text-xs uppercase leading-5 tracking-archive text-ink/50">
              Magazine preview opens from the real PDF archive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
