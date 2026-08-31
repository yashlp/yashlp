import { CONTACT } from "@/lib/metals/catalog";

export function MetalsFooter() {
  return (
    <footer className="border-t border-neutral-800 py-8">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left lg:px-10">
        <p className="text-xs text-neutral-600">
          © {new Date().getFullYear()} Jagetiya Metals · GST {CONTACT.gst}
        </p>
        <p className="text-xs text-neutral-600">
          {CONTACT.address}
        </p>
      </div>
    </footer>
  );
}
