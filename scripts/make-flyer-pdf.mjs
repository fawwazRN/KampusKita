// Membuat flyer PDF A4 dari flyer PNG.
// Jalankan: npm run pdf
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "public", "assets", "flyer-genap.png");
const outputDir = path.join(root, "public");
const output = path.join(
  outputDir,
  "flyer-pendaftaran-kuliah-islam-abu-dzar-genap-2026-2027.pdf",
);

const A4 = { width: 595.28, height: 841.89 };

async function main() {
  await mkdir(outputDir, { recursive: true });

  const png = await readFile(source);
  const pdf = await PDFDocument.create();

  pdf.setTitle(
    "Flyer Pendaftaran Kuliah Islam Abu Dzar — Semester Genap 2026/2027",
  );
  pdf.setAuthor("Kuliah Islam Abu Dzar");
  pdf.setSubject(
    "Pendaftaran mahasiswa baru semester genap 2026/2027 — PAI & PGMI",
  );
  pdf.setKeywords([
    "Kuliah Islam Abu Dzar",
    "KITA",
    "PAI",
    "PGMI",
    "Pendaftaran",
    "Genap 2026/2027",
  ]);
  pdf.setCreator("Kuliah Islam Abu Dzar");
  pdf.setProducer("Kuliah Islam Abu Dzar");
  pdf.setLanguage("id-ID");

  const image = await pdf.embedPng(png);
  const page = pdf.addPage([A4.width, A4.height]);

  const margin = 18;
  const maxWidth = A4.width - margin * 2;
  const maxHeight = A4.height - margin * 2;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (A4.width - width) / 2;
  const y = (A4.height - height) / 2;

  page.drawImage(image, { x, y, width, height });

  // Tautan ke halaman pendaftaran pada seluruh area flyer.
  const linkAnnotation = pdf.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + width, y + height],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of("https://kampuskita.id/#daftar"),
    },
  });
  const annots = page.node.lookup(PDFName.of("Annots"));
  if (annots) {
    annots.push(linkAnnotation);
  } else {
    page.node.set(PDFName.of("Annots"), pdf.context.obj([linkAnnotation]));
  }

  const bytes = await pdf.save();
  await writeFile(output, bytes);

  console.log(`✓ PDF dibuat: ${path.relative(root, output)}`);
  console.log(`  Ukuran: ${(bytes.length / 1024).toFixed(0)} KB · A4 ${A4.width}×${A4.height} pt`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
