import full from "../assets/logo-kita-t.png";
import fullLight from "../assets/logo-kita-light.png";
import mark from "../assets/logo-mark-t.png";
import markLight from "../assets/logo-mark-light.png";

/* tone: "dark" = latar gelap (logo putih+hijau) | "light" = latar terang (logo asli) */
export default function Logo({ tone = "light", variant = "mark", className = "", height = 40 }) {
  const dark = tone === "dark";
  const src = variant === "full" ? (dark ? fullLight : full) : dark ? markLight : mark;
  const ratio = variant === "full" ? 1100 / 566 : 1094 / 470;
  return (
    <img
      src={src}
      alt="Logo Kuliah Islam Abu Dzar"
      width={Math.round(height * ratio)}
      height={height}
      className={`logo ${className}`}
      style={{ height, width: "auto" }}
      decoding="async"
    />
  );
}
