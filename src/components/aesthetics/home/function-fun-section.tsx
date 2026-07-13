import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";

export function FunctionFunSection() {
  return (
    <section className="aes-dark-section px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="aes-section-title text-white">
              Where curation
              <br />
              meets discovery
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-white/75">
              We provide joy-enhancing alternatives to endless scrolling — a smarter way to find
              objects that match your better-for-you lifestyle choices.
            </p>
            <Link href="/aesthetics/discover" className="mt-8 inline-block">
              <Button variant="light">Learn more</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
