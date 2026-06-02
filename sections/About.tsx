import { SectionLabel } from "@/components/SectionLabel";
import { PortraitFrame } from "@/components/PortraitFrame";

const indexCards = [
  "MATERIAL STUDY",
  "ARCHIVE",
  "MEMORY",
  "OBJECTS",
  "TEXTILE",
  "RESEARCH",
  "IMAGE MAKING",
  "PUBLICATION",
  "STORYTELLING",
  "RITUAL"
];

export function About() {
  return (
    <section id="about" className="paper-section section-padding">
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
          <PortraitFrame />
          <div className="archive-index-cards mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {indexCards.map((card, index) => (
              <span key={card} className="archive-index-card" style={{ animationDelay: `${index * 0.18}s` }}>
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
