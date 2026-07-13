export function PhilosophySection() {
  return (
    <section className="aes-dark-section relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <p className="aes-label text-center text-[var(--aes-gold-soft)]">
          All designed to nurture your well-being
        </p>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-8">
          <article className="border-t border-[var(--aes-border-light)] pt-10 lg:pr-12">
            <h2 className="aes-display text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-wide text-[var(--aes-sand)]">
              PAST
              <br />
              <span className="italic text-[var(--aes-gold-soft)]">WISDOM</span>
            </h2>
            <p className="aes-serif mt-8 text-lg italic leading-relaxed text-[var(--aes-sand)]/70 sm:text-xl">
              Drawing on timeless traditions and age-old practices, we honour the healing wisdom of craft — ceramics, textiles, and objects made to last.
            </p>
          </article>

          <article className="border-t border-[var(--aes-border-light)] pt-10 lg:pl-12">
            <h2 className="aes-display text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-wide text-[var(--aes-sand)]">
              MODERN
              <br />
              <span className="italic text-[var(--aes-gold-soft)]">EXPERIENCES</span>
            </h2>
            <p className="aes-serif mt-8 text-lg italic leading-relaxed text-[var(--aes-sand)]/70 sm:text-xl">
              Blending innovation and luxury, we curate cutting-edge design from independent makers — objects that rejuvenate your space and spirit.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
