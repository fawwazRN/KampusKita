import { ArrowRight, Clock3 } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import { academicCalendar } from "../data/academic";
import { track } from "../lib/track";
import { useInView } from "../lib/hooks";

export default function Akademik({ onRegister }) {
  const [ref, seen] = useInView({ threshold: 0.25 });
  return (
    <section id="akademik" className="akad" data-tone="light">
      <div className="wrap">
        <header className="akad__head">
          <Reveal><p className="eyebrow">08 · Semester genap 2026/2027</p></Reveal>
          <Words text={"Lintasan semester,\n*Anda* di titik awal."} className="h-section" />
          <Reveal delay={150}><p className="lead">Tanggal PBAK, awal kuliah, UTS, UAS, dan libur akan diumumkan setelah kalender akademik kampus ditetapkan.</p></Reveal>
        </header>
        <ol ref={ref} className={`track${seen ? " is-in" : ""}`}>
          {academicCalendar.map((it, i) => (
            <li key={it.label} className={`tnode${it.value ? " is-now" : ""}`} style={{ "--k": i }}>
              <span className="tnode__dot">{it.value ? <i /> : null}</span>
              {it.value ? <span className="tnode__here">Anda di sini</span> : null}
              <b>{it.label}</b>
              <small>{it.value ? it.value : (<><Clock3 size={12} /> Segera diumumkan</>)}</small>
            </li>
          ))}
        </ol>
        <Reveal className="akad__cta">
          <button type="button" className="btn btn--navy" onClick={() => { track("registration_open", { source: "akademik" }); onRegister(); }}>Mulai dari pendaftaran <ArrowRight size={18} className="arr" /></button>
        </Reveal>
      </div>
    </section>
  );
}
