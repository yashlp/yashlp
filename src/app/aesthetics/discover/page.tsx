import { DiscoverFeed } from "@/components/aesthetics/discover/discover-feed";

export const metadata = { title: "Discover" };

export default function DiscoverPage() {
  return (
    <div className="mx-auto h-dvh max-w-lg md:my-4 md:h-[calc(100dvh-2rem)] md:rounded-[2.5rem] md:border md:border-[var(--aes-border)] md:shadow-2xl md:overflow-hidden">
      <DiscoverFeed />
    </div>
  );
}
