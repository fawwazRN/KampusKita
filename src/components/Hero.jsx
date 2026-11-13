import { useRef } from "react";
import { ArrowDown, ArrowRight, CalendarDays, CheckCircle2, Play, ShieldCheck } from "lucide-react";
import Clock from "./Clock";
import Words from "./Words";
import Reveal from "./Reveal";
import { track } from "../lib/track";
import { clamp01, useScrollPhases } from "../lib/hooks";

const START = 9 * 60 + 2; // Senin 09.02
const END = 17 * 60; // 17.00

/* Hari kerja yang "dijalani" pengunjung lewat scroll */
const agenda = [
  { at: 0, text: "Hari kerja dimulai. Kuliah? Nanti saja…" },
  { at: 10 * 60, text: "Rapat dulu." },
  { at: 12 * 60, text: "Laporan menumpuk." },
  { at: 14 * 60, text: "Deadline mendekat." },
  { at: 16 * 60, text: "Lembur lagi." },
  { at: 16 * 60 + 40, text: "Macet di jalan pulang." },
  { at: END, text: "Pukul 17.00 — tenaga habis. Kuliah terasa mustahil." },
];
const burdens = [
  { label: "Rapat", at: 10 * 60, cls: "a" },
  { label: "Laporan", at: 12 * 60, cls: "b" },
  { label: "Deadline", at: 14 * 60, cls: "c" },
  { label: "Lembur", at: 16 * 60, cls: "d" },
  { label: "Macet", at: 16 * 60 + 40, cls: "e" },
];
const facts = [
  { label: "Status dapat diverifikasi via PDDIKTI", icon: ShieldCheck },
  { label: "Kurikulum OBE", icon: CheckCircle2 },
  { label: "Online via Google Meet & Classroom", icon: CalendarDays },
];
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(Math.floor(m % 60)).padStart(2, "0")}`;

export default function Hero({ ready, onRegister, onPlay }) {
  const ref = useRef(null);
  const state = useRef({ idx: -1, chips: [] });

  /* Jam, agenda, dan beban kerja digerakkan LANGSUNG oleh scroll */
  useScrollPhases(ref, {
    mode: "pin",
    phases: { day: [0.03, 0.8], fin: [0.84, 0.95] },
    onProgress: (p, el) => {
      const day = clamp01((p - 0.03) / 0.77);
      const minutes = START + (END - START) * day;
      el.style.setProperty("--h", ((minutes / 60) % 12) * 30);
      el.style.setProperty("--m", (minutes % 60) * 6);
      const st = state.current;
      const dig = el.querySelector("[data-digital]");
      if (dig) dig.textContent = fmt(minutes);
      let idx = 0;
      agenda.forEach((a, i) => { if (a.at === 0 || minutes >= a.at) idx = i; });
      if (st.idx !== idx) {
        st.idx = idx;
        el.querySelectorAll("[data-agenda]").forEach((n, i) => n.classList.toggle("is-on", i === idx));
        el.querySelector(".hero__digital")?.classList.toggle("is-late", idx >= 4);
      }
      el.querySelectorAll("[data-chip]").forEach((n) => n.classList.toggle("is-on", minutes >= Number(n.dataset.chip)));
    },
  });

  return (
    <section id="beranda" ref={ref} className="hero" data-tone="dark">
      <div className="hero__stick">
        <div className="hero__sky" aria-hidden="true">
          <div className="hero__glow hero__glow--a" />
          <div className="hero__glow hero__glow--b" />
          <div className="hero__grid grid-lines" />
        </div>

        <div className="wrap hero__layout">
          <div className="hero__copy">
            <Reveal timed enabled={ready} className="hero__ask" variant="fade">
              <span className="hero__ask-dot" aria-hidden="true" />
              Mau raih gelar sarjana, tapi waktu habis buat kerja?
            </Reveal>

            <Words timed enabled={ready} as="h1" className="h-display hero__h1" delay={120} text={"Kuliah Islam\n*Terbuka* untuk\nSemua Kalangan."} />

            <Reveal timed enabled={ready} delay={600} className="lead hero__lead">
              <p>
                Lulusan SMA, guru, karyawan, ibu rumah tangga, hingga pensiunan — raih gelar <strong>S.Pd.</strong> sambil tetap menjalani aktivitas Anda. Kuliah online di akhir pekan, dari mana saja.
              </p>
            </Reveal>

            <Reveal timed enabled={ready} delay={720} className="hero__cta">
              <button type="button" className="btn btn--gold" onClick={() => { track("registration_open", { source: "hero" }); onRegister(); }}>
                Daftar Sekarang <ArrowRight size={18} strokeWidth={2.8} className="arr" />
              </button>
              <button type="button" className="btn btn--ghost-d hero__play" onClick={onPlay}>
                <span className="hero__play-ico" aria-hidden="true"><Play size={14} fill="currentColor" /></span>
                Tonton ceritanya <small>40 dtk</small>
              </button>
            </Reveal>

            <Reveal timed enabled={ready} delay={840} className="hero__facts">
              <ul>
                {facts.map((f) => {
                  const Icon = f.icon;
                  return (<li key={f.label}><Icon size={14} strokeWidth={2.5} aria-hidden="true" />{f.label}</li>);
                })}
              </ul>
            </Reveal>
          </div>

          <Reveal timed enabled={ready} variant="scale" delay={200} className="hero__stage">
            <div className="hero__arch" aria-hidden="true" />
            <div className="hero__clock">
              <Clock label="Jam yang berjalan dari 09.02 sampai 17.00 mengikuti gulir Anda" />
              {burdens.map((b) => (
                <span key={b.label} data-chip={b.at} className={`chip chip--${b.cls}`}><i aria-hidden="true" />{b.label}</span>
              ))}
            </div>
            <div className="hero__digital">
              <div className="hero__dig-top"><span>Senin</span><b className="num" data-digital>09.02</b></div>
              <ul className="hero__agenda" aria-live="polite">
                {agenda.map((a, i) => (<li key={a.text} data-agenda className={i === 0 ? "is-on" : ""}>{a.text}</li>))}
              </ul>
              <span className="hero__track" aria-hidden="true"><i /></span>
            </div>
          </Reveal>
        </div>

        <a href="#solusi" className="hero__cue" aria-label="Gulir ke bagian berikutnya">
          <span className="hero__cue-a">Gulir — jalani hari kerja ini</span>
          <span className="hero__cue-b">Tapi masih ada akhir pekan</span>
          <ArrowDown size={16} strokeWidth={2.6} />
        </a>
      </div>
    </section>
  );
}
