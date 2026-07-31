import Link from "next/link";

export function FunctionFunSection() {
  return (
    <section className="aes-dark-section px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="aes-joy-title-lower text-white">
              where taste
              <br />
              meets intention
            </h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-white/75 sm:text-lg">
              We&apos;re the joy-enhancing alternative to endless scrolling — curated objects from
              independent makers that match your better-for-you lifestyle, not a generic algorithm.
            </p>
            <Link href="/aesthetics/about" className="aes-btn aes-btn-light mt-8 inline-flex px-8 py-3.5">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
