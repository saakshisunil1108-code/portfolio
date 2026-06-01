import { figmaScreens } from "@/lib/figmaScreens";

export function FigmaPortfolioShell() {
  if (figmaScreens.length === 0) {
    return null;
  }

  return (
    <div>
      {figmaScreens.map((screen) => (
        <section key={screen.id} className="min-h-screen" aria-label={screen.name}>
          {screen.component}
        </section>
      ))}
    </div>
  );
}
