import Link from "next/link";

type Photo = {
  id: string;
  imageUrl: string | null;
  body: string | null;
  product: { name: string; slug: string };
  customer: { name: string | null } | null;
};

export function CustomerPhotosSection({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-xl">
          <p className="aes-gallery-eyebrow">In real homes</p>
          <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Customer Photos</h2>
          <p className="mt-3 text-sm text-[var(--aes-ink-muted)]">
            Pieces as they live — shared by customers after delivery.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p) =>
            p.imageUrl ? (
              <Link
                key={p.id}
                href={`/aesthetics/product/${p.product.slug}`}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt={p.product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-8 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  {p.customer?.name || "Customer"} · {p.product.name}
                </span>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
