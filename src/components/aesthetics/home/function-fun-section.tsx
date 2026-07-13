import Link from "next/link";

export function FunctionFunSection() {
  return (
    <section className="aes-dark-section px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="aes-joy-title-lower text-white">
              where curation
              <br />
              meets craft
            </h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg">
              We provide joy-enhancing alternatives that match your better-for-you lifestyle
              choices — curated objects from independent makers, not endless scrolling.
            </p>
            <Link href="/aesthetics/collections" className="aes-btn aes-btn-light mt-8 inline-flex px-8 py-3.5">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
