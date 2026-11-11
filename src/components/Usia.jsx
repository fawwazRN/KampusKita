import { useEffect, useRef, useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import { useCountUp, useInView } from "../lib/hooks";

const personas = [
  { id: "sma", who: "Lulusan SMA", age: 17, text: "Baru lulus SMA/MA/SMK dan ingin langsung kuliah, tanpa harus meninggalkan kegiatan lain." },
  { id: "kar", who: "Karyawan", age: 25, text: "Jam kerja tetap aman. Kuliah online jatuh di akhir pekan." },
  { id: "gur", who: "Guru", age: 35, text: "Perdalam ilmu dan raih gelar S.Pd. sambil tetap mengajar." },
  { id: "irt", who: "Ibu rumah tangga", age: 45, text: "Belajar dari rumah, di sela waktu bersama keluarga." },
  { id: "pen", who: "Pensiunan", age: 60, plus: true, text: "Ilmu tidak mengenal masa pensiun. Mulai kapan pun Anda siap." },
];
const MIN = 15, MAX = 68;
const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

export default function Usia() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const [idx, setIdx] = useState(1);
  const touched = useRef(false);
  const p = personas[idx];
  const shown = useCountUp(p.age, { duration: 900, from: 0 });
  const pos = ((Math.min(p.age, MAX - 6) - MIN) / (MAX - MIN)) * 100;

  useEffect(() => {
    if (!seen) return undefined;
    const t = window.setInterval(() => {
      if (!touched.current) setIdx((i) => (i + 1) % personas.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [seen]);

  const pick = (i) => { touched.current = true; setIdx(i); };

  return (
    <section id="terbuka" className="usia" data-tone="light" ref={ref}>
      <div className="wrap usia__grid">
        <div className="usia__left">
          <Reveal><p className="eyebrow usia__eb">03 · Terbuka</p></Reveal>
          <Words text={"Terbuka untuk\n*semua* usia."} className="h-section usia__h" />
          <Reveal delay={150}>
            <p className="lead usia__lead">Gelar sarjana bukan hanya untuk yang baru lulus. Pilih sosok yang paling mirip Anda.</p>
          </Reveal>
          <Reveal delay={250}>
            <div className="personas" role="tablist" aria-label="Pilih latar belakang">
              {personas.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={i === idx} className={`persona${i === idx ? " is-on" : ""}`} onClick={() => pick(i)}>
                  <span className="num">{x.age}{x.plus ? "+" : ""}</span>{x.who}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="usia__gender"><Users size={16} aria-hidden="true" /> Baik pria maupun wanita.</p>
          </Reveal>
        </div>

        <Reveal variant="scale" className="usia__card" delay={150}>
          <div className="usia__age" aria-live="polite">
            <small>Contoh usia</small>
            <b className="num">{shown}{p.plus && shown === p.age ? "+" : ""}</b>
            <span>tahun</span>
          </div>
          <div className="ruler" aria-hidden="true">
            <div className="ruler__ticks">
              {ticks.map((t) => (<i key={t} className={t % 10 === 0 ? "maj" : t % 5 === 0 ? "mid" : ""}>{t % 10 === 0 ? <em>{t}</em> : null}</i>))}
            </div>
            <span className="ruler__thumb" style={{ left: `${pos}%` }}><GraduationCap size={18} strokeWidth={2.4} /></span>
          </div>
          <div className="usia__msg" key={p.id}>
            <h3>{p.who}</h3>
            <p>{p.text}</p>
          </div>
          <p className="usia__foot">Ketentuan usia pendaftaran mengikuti kebijakan yang berlaku.</p>
        </Reveal>
      </div>
    </section>
  );
}
