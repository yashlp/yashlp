/** Export a DOM element as a multi-page A4 PDF download. */
export async function downloadElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const prevOverflow = element.style.overflow;
  const prevHeight = element.style.height;
  const prevMaxHeight = element.style.maxHeight;

  element.style.overflow = "visible";
  element.style.height = "auto";
  element.style.maxHeight = "none";

  element.scrollIntoView({ block: "start", behavior: "instant" });
  await waitForPaint();

  const width = element.scrollWidth;
  const height = element.scrollHeight;

  if (width < 1 || height < 1) {
    restoreElementStyles(element, prevOverflow, prevHeight, prevMaxHeight);
    throw new Error("Report has no visible content to export");
  }

  try {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const slices = planCaptureSlices(width, height);
    let pdfY = 0;
    let pageAdded = false;

    for (const slice of slices) {
      const canvas = await captureSlice(element, width, slice, (clonedDoc, clonedElement) => {
        prepareCloneForPdf(element, clonedElement, clonedDoc);
      });

      if (isCanvasBlank(canvas)) {
        throw new Error("Blank canvas");
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const sliceHeightMm = (canvas.height * pageWidth) / canvas.width;
      let offsetMm = 0;

      while (offsetMm < sliceHeightMm) {
        const spaceLeft = pageHeight - pdfY;
        if (spaceLeft < 1) {
          pdf.addPage();
          pdfY = 0;
          pageAdded = true;
          continue;
        }

        const drawHeightMm = Math.min(spaceLeft, sliceHeightMm - offsetMm);
        const sourceYPx = (offsetMm / sliceHeightMm) * canvas.height;
        const sourceHeightPx = (drawHeightMm / sliceHeightMm) * canvas.height;

        const tile = cropCanvas(canvas, 0, sourceYPx, canvas.width, sourceHeightPx);
        const tileData = tile.toDataURL("image/jpeg", 0.92);
        const tileHeightMm = (tile.height * pageWidth) / tile.width;

        pdf.addImage(tileData, "JPEG", 0, pdfY, pageWidth, tileHeightMm);
        pdfY += tileHeightMm;
        offsetMm += drawHeightMm;

        if (offsetMm < sliceHeightMm && pdfY >= pageHeight - 0.5) {
          pdf.addPage();
          pdfY = 0;
          pageAdded = true;
        }
      }
    }

    if (!pageAdded && pdfY < 1) {
      throw new Error("Blank canvas");
    }

    pdf.save(filename);
  } finally {
    restoreElementStyles(element, prevOverflow, prevHeight, prevMaxHeight);
  }
}

/** Reliable fallback — opens print dialog (user picks Save as PDF). */
export function printReportAsPdf(element: HTMLElement): void {
  const printStyle = document.createElement("style");
  printStyle.id = "civiclens-report-print";
  printStyle.textContent = `
    @media print {
      body > *:not(#civiclens-print-mount) { display: none !important; }
      #civiclens-print-mount {
        display: block !important;
        position: static !important;
        width: 100% !important;
      }
      #civiclens-print-mount * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `;

  const mount = document.createElement("div");
  mount.id = "civiclens-print-mount";
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.overflow = "visible";
  clone.style.boxShadow = "none";
  clone.style.maxHeight = "none";
  mount.appendChild(clone);

  document.head.appendChild(printStyle);
  document.body.appendChild(mount);

  const cleanup = () => {
    printStyle.remove();
    mount.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}

type CaptureSlice = { offsetY: number; height: number; scale: number };

const MAX_CANVAS_PX = 12000;
const SLICE_HEIGHT_PX = 3200;

function planCaptureSlices(width: number, totalHeight: number): CaptureSlice[] {
  const slices: CaptureSlice[] = [];
  let offsetY = 0;

  while (offsetY < totalHeight) {
    const height = Math.min(SLICE_HEIGHT_PX, totalHeight - offsetY);
    const scale = Math.min(2, MAX_CANVAS_PX / width, MAX_CANVAS_PX / height);
    slices.push({ offsetY, height, scale: Math.max(scale, 0.35) });
    offsetY += height;
  }

  return slices;
}

async function captureSlice(
  element: HTMLElement,
  width: number,
  slice: CaptureSlice,
  onclone: (doc: Document, el: HTMLElement) => void
): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");

  return html2canvas(element, {
    scale: slice.scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    foreignObjectRendering: false,
    width,
    height: slice.height,
    x: 0,
    y: slice.offsetY,
    windowWidth: width,
    windowHeight: slice.height,
    scrollX: 0,
    scrollY: -slice.offsetY,
    onclone,
  });
}

function prepareCloneForPdf(original: HTMLElement, clone: HTMLElement, doc: Document): void {
  clone.style.overflow = "visible";
  clone.style.height = "auto";
  clone.style.maxHeight = "none";
  clone.style.boxShadow = "none";
  clone.style.background = "#ffffff";
  clone.style.width = `${original.scrollWidth}px`;

  const origNodes = [original, ...Array.from(original.querySelectorAll("*"))];
  const cloneNodes = [clone, ...Array.from(clone.querySelectorAll("*"))];

  origNodes.forEach((origEl, idx) => {
    const cloneEl = cloneNodes[idx] as HTMLElement | undefined;
    if (!cloneEl || !(origEl instanceof HTMLElement)) return;

    inlineComputedStyles(origEl, cloneEl);
  });

  const styleFix = doc.createElement("style");
  styleFix.textContent = `
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  `;
  doc.head.appendChild(styleFix);
}

const INLINE_PROPS = [
  "color",
  "backgroundColor",
  "fontSize",
  "fontWeight",
  "fontFamily",
  "lineHeight",
  "textAlign",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopStyle",
  "borderRightStyle",
  "borderBottomStyle",
  "borderLeftStyle",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
  "display",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "gap",
  "opacity",
  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
] as const;

function inlineComputedStyles(origEl: HTMLElement, cloneEl: HTMLElement): void {
  const cs = window.getComputedStyle(origEl);

  cloneEl.style.setProperty("backdrop-filter", "none");
  cloneEl.style.setProperty("-webkit-backdrop-filter", "none");

  for (const prop of INLINE_PROPS) {
    const value = cs[prop];
    if (value) cloneEl.style[prop] = value;
  }

  const bgImage = cs.backgroundImage;
  if (bgImage && bgImage !== "none" && bgImage.includes("gradient")) {
    cloneEl.style.background = cloneEl.dataset.pdfCover === "true" ? "#ea580c" : cs.backgroundColor || "#ffffff";
    cloneEl.style.backgroundImage = "none";
    if (cloneEl.dataset.pdfCover === "true") cloneEl.style.color = "#ffffff";
  } else if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)") {
    cloneEl.style.backgroundColor = cs.backgroundColor;
  }
}

function cropCanvas(
  source: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(source, x, y, width, height, 0, 0, width, height);
  return canvas;
}

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx || canvas.width === 0 || canvas.height === 0) return true;

  const sampleW = Math.min(160, canvas.width);
  const sampleH = Math.min(160, canvas.height);
  const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

  let nonWhite = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a > 10 && (r < 248 || g < 248 || b < 248)) nonWhite++;
  }
  return nonWhite < 12;
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function restoreElementStyles(
  element: HTMLElement,
  overflow: string,
  height: string,
  maxHeight: string
): void {
  element.style.overflow = overflow;
  element.style.height = height;
  element.style.maxHeight = maxHeight;
}

export function reportPdfFilename(productSlug: string, areaName: string): string {
  const area = areaName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `civiclens-${productSlug}-${area || "report"}-${date}.pdf`;
}
