// Membuat flyer.webp (pratinjau di bagian Biaya) dari flyer sumber.
// Jalankan: npm run assets
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await sharp(path.join(root, "public/assets/flyer-genap.png"))
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 84, effort: 6 })
  .toFile(path.join(root, "src/assets/flyer.webp"));
console.log("✓ src/assets/flyer.webp");
