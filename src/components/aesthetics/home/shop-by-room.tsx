import Link from "next/link";
import { SHOP_BY_ROOMS } from "@/lib/aesthetics/shop-constants";

const ROOM_TONES = [
  "from-[#e8dfd4] to-[#d4c4b0]",
  "from-[#dfe6ef] to-[#c5d0e0]",
  "from-[#e6ddd2] to-[#cfc0ad]",
  "from-[#e8e2d8] to-[#d0c8b8]",
  "from-[#dde8e4] to-[#b8cdc4]",
  "from-[#ebe4da] to-[#d5cabb]",
];

export function ShopByRoomSection() {
  return (
    <section className="aes-bg-sand px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-xl">
          <p className="aes-gallery-eyebrow">Discover</p>
          <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Shop by Room</h2>
          <p className="mt-3 text-sm text-[var(--aes-ink-muted)]">
            Transitions, corners, and daily rituals — find pieces staged for the spaces you actually live in.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {SHOP_BY_ROOMS.map((room, i) => (
            <Link
              key={room.slug}
              href={`/aesthetics/shop?room=${room.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${ROOM_TONES[i % ROOM_TONES.length]} transition duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-sm font-semibold tracking-wide text-white sm:text-base">
                {room.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
