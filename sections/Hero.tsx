const HERO_VIDEO = "/assets/updated-hero-video.mp4";

export function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-screen overflow-hidden bg-[#c8c8c4]" aria-label="Saakshi Sunil embossed chrome foil animation">
      <video
        className="block h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Embossed Saakshi Sunil signature on silver foil"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
    </section>
  );
}
