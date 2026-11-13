import mark from "../assets/logo-mark-t.webp";
import markLight from "../assets/logo-mark-light.webp";

/* tone: "dark" = latar gelap (logo putih+hijau) | "light" = latar terang (logo asli) */
export default function Logo({ tone = "light", className = "", height = 40 }) {
  const dark = tone === "dark";
  return (
    <img src={dark ? markLight : mark} alt="Logo Kuliah Islam Abu Dzar" width={Math.round(height * 2.33)} height={height} className={`logo ${className}`} style={{ height, width: "auto" }} decoding="async" />
  );
}
