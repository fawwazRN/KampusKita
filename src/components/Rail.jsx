const chapters = [
  { id: "beranda", label: "Masalah" },
  { id: "solusi", label: "Solusi" },
  { id: "terbuka", label: "Terbuka" },
  { id: "program-studi", label: "Prodi" },
  { id: "biaya", label: "Biaya" },
  { id: "cara-daftar", label: "Daftar" },
  { id: "dosen", label: "Dosen" },
  { id: "akademik", label: "Akademik" },
  { id: "faq", label: "Tanya" },
  { id: "mulai", label: "Mulai" },
];

export const chapterIds = chapters.map((c) => c.id);

export default function Rail({ active, tone }) {
  return (
    <nav className={`rail rail--${tone}`} aria-label="Bab halaman">
      {chapters.map((c, i) => (
        <a key={c.id} href={`#${c.id}`} className={`rail__item${active === c.id ? " is-active" : ""}`} aria-label={c.label} aria-current={active === c.id ? "true" : undefined}>
          <span className="rail__n num">{String(i + 1).padStart(2, "0")}</span>
          <span className="rail__dot" />
          <span className="rail__t">{c.label}</span>
        </a>
      ))}
    </nav>
  );
}
