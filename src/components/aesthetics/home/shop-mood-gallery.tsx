import Link from "next/link";

export const SHOP_MOOD_IMAGES = [
  {
    src: "/oa/shop-mood/01-bedroom-nightstand.jpg",
    alt: "Bedroom nightstand with mushroom lamp and greenery",
    label: "Bedroom calm",
  },
  {
    src: "/oa/shop-mood/02-living-corner.jpg",
    alt: "Living room corner with bouclé sofa and arched lamp",
    label: "Living soft",
  },
  {
    src: "/oa/shop-mood/03-desk-office.jpg",
    alt: "Sunlit desk with lamp, notebook, and coffee",
    label: "Work light",
  },
  {
    src: "/oa/shop-mood/04-kitchen-counter.jpg",
    alt: "Marble kitchen counter with pour-over and kettle",
    label: "Morning ritual",
  },
  {
    src: "/oa/shop-mood/05-bookshelf.jpg",
    alt: "Styled wooden bookshelf with lamp and ceramics",
    label: "Shelf edit",
  },
  {
    src: "/oa/shop-mood/06-bathroom-vanity.jpg",
    alt: "Bathroom vanity with apothecary bottles and candle",
    label: "Bath quiet",
  },
  {
    src: "/oa/shop-mood/07-window-nook.jpg",
    alt: "Window reading nook with pillows and knit throw",
    label: "Window nook",
  },
  {
    src: "/oa/shop-mood/08-art-side-table.jpg",
    alt: "Side table with flowers, candle, and wall art",
    label: "Art corner",
  },
  {
    src: "/oa/shop-mood/09-pendant-nightstand.jpg",
    alt: "Bedroom nightstand under a dome pendant light",
    label: "Night glow",
  },
  {
    src: "/oa/shop-mood/10-console-mirror.jpg",
    alt: "Console table with wavy mirror and tall greenery",
    label: "Entry calm",
  },
] as const;

/** 10 mood tiles directly under the Shop now CTA */
export function ShopMoodGallery() {
  return (
    <div className="aes-animate-fade-up mx-auto mt-12 w-full max-w-5xl sm:mt-14" style={{ animationDelay: "0.32s" }}>
      <p className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--aes-ink-muted)] sm:mb-6 sm:text-[11px]">
        Moods to live in
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3">
        {SHOP_MOOD_IMAGES.map((item, i) => (
          <Link
            key={item.src}
            href="/aesthetics/shop"
            className="group relative block overflow-hidden rounded-xl bg-[var(--aes-cream-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aes-royal)]"
            style={{ animationDelay: `${0.34 + i * 0.03}s` }}
          >
            <div className="aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                width={900}
                height={900}
                loading={i < 4 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pb-2 pt-8 text-left text-[10px] font-medium tracking-wide text-white sm:text-[11px]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
