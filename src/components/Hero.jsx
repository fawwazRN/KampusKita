import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, CheckCircle2, Play, ShieldCheck } from "lucide-react";
import Clock from "./Clock";
import Words from "./Words";
import Reveal from "./Reveal";
import { track } from "../lib/track";
import { prefersReducedMotion, useScrollPhases } from "../lib/hooks";

const START = 9 * 60 + 2; // 09.02
const END = 17 * 60; // 17.00
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

const fmt = (m) => {
  const mm = Math.floor(m);
  return `${String(Math.floor(mm / 60)).padStart(2, "0")}.${String(mm % 60).padStart(2, "0")}`;
};

export default function Hero({ ready, onRegister, onPlay }) {
  const ref = useRef(null);
  const [minutes, setMinutes] = useState(prefersReducedMotion() ? END : START);
  const [settled, setSettled] = useState(prefersReducedMotion());

  useScrollPhases(ref, { mode: "exit" });

  /* jam berjalan cepat dari 09.02 ke 17.00 setelah gerbang terbuka */
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;
    let raf;
    const dur = 3600;
    const t0 = performance.now() + 500;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - t0) / dur));
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setMinutes(START + (END - START) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setSettled(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <section id="beranda" ref={ref} className="hero" data-tone="dark">
      <div className="hero__sky" aria-hidden="true">
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
        <div className="hero__grid grid-lines" />
      </div>

      <div className="wrap hero__layout">
        <div className="hero__copy">
          <Reveal enabled={ready} className="hero__ask" variant="fade">
            <span className="hero__ask-dot" aria-hidden="true" />
            Mau raih gelar sarjana, tapi waktu habis buat kerja?
          </Reveal>

          <Words enabled={ready} as="h1" className="h-display hero__h1" delay={150} threshold={0.01} text={"Kuliah Islam\n*Terbuka* untuk\nSemua Kalangan."} />

          <Reveal enabled={ready} delay={650} className="lead hero__lead">
            <p>
              Lulusan SMA, guru, karyawan, ibu rumah tangga, hingga pensiunan — raih gelar <strong>S.Pd.</strong> sambil tetap menjalani aktivitas Anda. Kuliah online di akhir pekan, dari mana saja.
            </p>
          </Reveal>

          <Reveal enabled={ready} delay={780} className="hero__cta">
            <button
              type="button"
              className="btn btn--gold"
              onClick={() => {
                track("registration_open", { source: "hero" });
                onRegister();
              }}
            >
              Daftar Sekarang <ArrowRight size={18} strokeWidth={2.8} className="arr" />
            </button>
            <button type="button" className="btn btn--ghost-d hero__play" onClick={onPlay}>
              <span className="hero__play-ico" aria-hidden="true">
                <Play size={14} fill="currentColor" />
              </span>
              Tonton ceritanya <small>40 dtk</small>
            </button>
          </Reveal>

          <Reveal enabled={ready} delay={900} className="hero__facts">
            <ul>
              {facts.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.label}>
                    <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
                    {f.label}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal enabled={ready} variant="scale" delay={250} className="hero__stage">
          <div className="hero__arch" aria-hidden="true" />
          <div className="hero__clock">
            <Clock minutes={minutes} ticking={settled} />
            {burdens.map((b) => (
              <span key={b.label} className={`chip chip--${b.cls}${minutes >= b.at ? " is-on" : ""}`}>
                <i aria-hidden="true" />
                {b.label}
              </span>
            ))}
          </div>
          <div className={`hero__digital${settled ? " is-settled" : ""}`} aria-live="off">
            <span>Jam kerja</span>
            <b className="num">{fmt(minutes)}</b>
          </div>
        </Reveal>
      </div>

      <a href="#solusi" className="hero__cue" aria-label="Gulir ke bagian berikutnya">
        <span>Gulir — lihat pekan Anda</span>
        <ArrowDown size={16} strokeWidth={2.6} />
      </a>
    </section>
  );
}
