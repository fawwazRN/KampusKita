import { ArrowRight, BookOpen, CheckCircle2, School } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import { useInView } from "../lib/hooks";
import { programs } from "../data/programs";
import { track } from "../lib/track";

function EmblemPai() {
  return (
    <svg viewBox="0 0 240 180" aria-hidden="true" className="emb">
      <defs><radialGradient id="e1" cx=".5" cy=".6" r=".6"><stop offset="0" stopColor="#f2c14e" stopOpacity=".55" /><stop offset="1" stopColor="#f2c14e" stopOpacity="0" /></radialGradient></defs>
      <circle cx="120" cy="96" r="84" fill="url(#e1)" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1="120" y1="96" x2={120 + Math.cos(Math.PI + (i * Math.PI) / 8) * 92} y2={96 + Math.sin(Math.PI + (i * Math.PI) / 8) * 92} stroke="#f2c14e" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />)}
      <path d="M120 150 C96 134 56 132 30 140 V70 C58 62 98 64 120 84 Z" fill="#fff" />
      <path d="M120 150 C144 134 184 132 210 140 V70 C182 62 142 64 120 84 Z" fill="#e3eff9" />
      <path d="M120 84 V150" stroke="#123c75" strokeWidth="3" />
      {[0, 1, 2].map((i) => <path key={i} d={`M42 ${88 + i * 12} C62 ${84 + i * 12} 86 ${86 + i * 12} 108 ${98 + i * 12}`} stroke="#123c75" strokeOpacity=".3" strokeWidth="3" fill="none" strokeLinecap="round" />)}
      <path d="M132 98 C152 88 178 86 196 90" stroke="#8cc63f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="120" cy="40" r="9" fill="#f2c14e" />
    </svg>
  );
}
function EmblemPgmi() {
  return (
    <svg viewBox="0 0 240 180" aria-hidden="true" className="emb">
      <circle cx="120" cy="100" r="82" fill="#f2c14e" fillOpacity=".16" />
      <rect x="40" y="108" width="160" height="50" rx="4" fill="#fff" />
      <path d="M92 108 V86 a28 28 0 0 1 56 0 V108 Z" fill="#e3eff9" />
      <path d="M104 158 V126 a16 16 0 0 1 32 0 V158 Z" fill="#123c75" />
      <path d="M96 62 a24 24 0 0 1 48 0 Z" fill="#f2c14e" />
      <path d="M120 34 V22" stroke="#f2c14e" strokeWidth="3" strokeLinecap="round" /><circle cx="120" cy="20" r="3.5" fill="#f2c14e" />
      {[52, 72, 156, 176].map((x) => <rect key={x} x={x} y="122" width="12" height="18" rx="6" fill="#123c75" fillOpacity=".25" />)}
      <rect x="28" y="156" width="184" height="6" rx="3" fill="#8cc63f" />
    </svg>
  );
}

export default function Prodi({ onRegister, onOpenCurriculum }) {
  const [ref, seen] = useInView({ threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  return (
    <section id="program-studi" className="prodi" data-tone="light">
      <div className="wrap">
        <header className="prodi__head">
          <Reveal><p className="eyebrow">04 · Pilih jalan Anda</p></Reveal>
          <Words text={"Dua program studi *S1*,\nsatu gelar S.Pd."} className="h-section" />
          <Reveal delay={150}><p className="lead">Dua program studi untuk membangun ilmu, kompetensi, dan pengalaman yang relevan dengan kebutuhan Anda.</p></Reveal>
        </header>

        <div ref={ref} className={`fork${seen ? " is-in" : ""}`}>
          <span className="fork__stem" aria-hidden="true" />
          <span className="fork__bar" aria-hidden="true" />
          <div className="fork__cards">
            {programs.map((p, i) => {
              const dark = p.id === "pgmi";
              return (
                <article key={p.id} className={`pcard${dark ? " pcard--dark" : ""}`} style={{ "--i": i }}>
                  <span className="pcard__drop" aria-hidden="true" />
                  <div className="pcard__arch">{dark ? <EmblemPgmi /> : <EmblemPai />}{p.badge ? <span className="pcard__badge">{p.badge}</span> : null}</div>
                  <div className="pcard__body">
                    <p className="pcard__short">{p.shortName}</p>
                    <h3>{p.name}</h3>
                    <p className="pcard__tag">{p.tagline}</p>
                    <p className="pcard__desc">{p.description}</p>
                    <ul className="pcard__list">{p.highlights.map((h) => <li key={h}><CheckCircle2 size={16} strokeWidth={2.4} />{h}</li>)}</ul>
                    <div className="pcard__act">
                      <button type="button" className={`btn btn--sm ${dark ? "btn--gold" : "btn--navy"}`} onClick={() => { track("registration_open", { source: `prodi_${p.id}` }); onRegister(p.id); }}>Daftar {p.shortName} <ArrowRight size={15} className="arr" /></button>
                      <button type="button" className="pcard__link" onClick={() => onOpenCurriculum(p.id)}>{dark ? <School size={15} /> : <BookOpen size={15} />} Struktur kurikulum</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
