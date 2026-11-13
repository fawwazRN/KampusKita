import { useMemo, useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import Clock from "./Clock";
import { clamp01, useScrollPhases } from "../lib/hooks";
import { site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

function skyline(seed, { h, minH, maxH, minW, maxW, w = 1600 }) {
  const r = rng(seed);
  let x = 0;
  const pts = [`0,${h}`];
  const blocks = [];
  while (x < w) {
    const bw = minW + r() * (maxW - minW);
    const bh = minH + r() * (maxH - minH);
    const top = Math.round(h - bh);
    pts.push(`${Math.round(x)},${top}`, `${Math.round(x + bw)},${top}`);
    blocks.push({ x, bw, top });
    x += bw;
  }
  pts.push(`${w},${h}`);
  return { d: `M${pts.join("L")}Z`, blocks };
}

/* Masjid kampus: kubah, dua menara, balkon */
const Mosque = () => (
  <g>
    <rect x="1060" y="270" width="240" height="130" />
    <path d="M1100 270a80 80 0 0 1 160 0Z" />
    <rect x="1178" y="160" width="4" height="32" />
    <circle cx="1180" cy="156" r="6" />
    <path d="M1040 270a24 24 0 0 1 48 0Z" /><path d="M1272 270a24 24 0 0 1 48 0Z" />
    {[1020, 1316].map((x) => (
      <g key={x}>
        <rect x={x} y="150" width="24" height="250" />
        <rect x={x - 6} y="206" width="36" height="8" />
        <path d={`M${x - 4} 150L${x + 12} 112L${x + 28} 150Z`} />
        <circle cx={x + 12} cy="106" r="4" />
      </g>
    ))}
  </g>
);

const stars = (() => { const r = rng(7); return Array.from({ length: 64 }, (_, i) => ({ x: r() * 1600, y: r() * 380, r: 0.8 + r() * 1.8, g: i % 3 })); })();
const phrases = ["Sabtu pagi,", "kelas dibuka."];

export default function Fajar({ onRegister }) {
  const ref = useRef(null);
  const far = useMemo(() => skyline(11, { h: 360, minH: 60, maxH: 190, minW: 50, maxW: 120 }), []);
  const near = useMemo(() => skyline(29, { h: 260, minH: 40, maxH: 150, minW: 70, maxW: 150 }), []);
  const windows = useMemo(() => {
    const r = rng(5);
    const out = [];
    near.blocks.forEach((b) => {
      const cols = Math.max(1, Math.floor(b.bw / 26));
      const rows = Math.min(4, Math.floor((260 - b.top) / 34));
      for (let c = 0; c < cols; c++) for (let rr = 0; rr < rows; rr++) if (r() > 0.55) out.push({ x: b.x + 12 + c * 24, y: b.top + 14 + rr * 30, w: 0.08 + r() * 0.7 });
    });
    return out.slice(0, 90);
  }, [near]);

  useScrollPhases(ref, {
    mode: "pin",
    phases: { rise: [0.02, 0.7], copy: [0.5, 0.74], bird: [0.15, 0.95] },
    onProgress: (p, el) => {
      const r = clamp01((p - 0.02) / 0.68);
      const minutes = 5 * 60 + 180 * r;
      el.style.setProperty("--h", ((minutes / 60) % 12) * 30);
      el.style.setProperty("--m", (minutes % 60) * 6);
      const d = el.querySelector("[data-fdigital]");
      if (d) d.textContent = `${String(Math.floor(minutes / 60)).padStart(2, "0")}.${String(Math.floor(minutes % 60)).padStart(2, "0")}`;
      el.classList.toggle("is-ready", p > 0.62);
    },
  });

  return (
    <section id="mulai" ref={ref} className="fajar" data-tone="dark" aria-label="Penutup: Sabtu pagi, kelas dibuka">
      <div className="fajar__stick">
        <div className="sc sc__night" aria-hidden="true" />
        <div className="sc sc__dawn" aria-hidden="true" />
        <svg className="sc sc__stars" viewBox="0 0 1600 400" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
          {[0, 1, 2].map((g) => (
            <g key={g} className={`tw tw--${g}`}>{stars.filter((s) => s.g === g).map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" />)}</g>
          ))}
        </svg>
        <div className="sc__sun" aria-hidden="true" />
        <svg className="sc sc__cloud" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="#fff"><ellipse cx="300" cy="150" rx="150" ry="22" /><ellipse cx="390" cy="132" rx="90" ry="20" /><ellipse cx="1150" cy="200" rx="190" ry="26" /><ellipse cx="1260" cy="178" rx="100" ry="22" /></g>
        </svg>
        <svg className="sc sc__far" viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d={far.d} /></svg>
        <svg className="sc sc__mid" viewBox="0 0 1600 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true"><g transform="translate(230 0)"><Mosque /></g></svg>
        <svg className="sc sc__near" viewBox="0 0 1600 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <path d={near.d} />
          <g className="sc__win">{windows.map((w, i) => <rect key={i} x={w.x} y={w.y} width="10" height="14" rx="2" style={{ "--w": w.w }} />)}</g>
        </svg>
        <svg className="sc sc__birds" viewBox="0 0 1600 400" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
          <g fill="none" stroke="#0b2a55" strokeWidth="3" strokeLinecap="round"><path d="M0 40q14-18 28 0q14-18 28 0" /><path d="M60 70q10-13 20 0q10-13 20 0" /><path d="M-40 90q9-12 18 0q9-12 18 0" /></g>
        </svg>
        <span className="fajar__ar" aria-hidden="true" lang="ar">اقْرَأْ</span>

        <div className="wrap fajar__hud">
          <div className="fajar__time">
            <div className="fajar__clock" aria-hidden="true"><Clock ticking label="Jam menuju Sabtu 08.00" /></div>
            <p><span>Sabtu</span><b className="num" data-fdigital>05.00</b></p>
          </div>
          <div className="fajar__copy">
            <p className="eyebrow fajar__eb">10 · Waktu Anda</p>
            <h2 className="h-display fajar__h">
              {phrases.map((t, k) => (<span key={t} className="fajar__ln" style={{ "--k": k }}>{k === 1 ? <>kelas <em className="w__em">dibuka.</em></> : t}</span>))}
              <span className="fajar__ln" style={{ "--k": 2 }}>Anda di mana?</span>
            </h2>
            <p className="lead fajar__lead">Pendaftaran semester genap 2026/2027 sudah dibuka. Konsultasi gratis via WhatsApp <b>{site.phoneDisplay}</b> — tim admisi membantu memilih prodi dan memandu pendaftaran.</p>
            <div className="fajar__act">
              <button type="button" className="btn btn--gold" onClick={() => { track("registration_open", { source: "cta" }); onRegister(); }}>Daftar Sekarang <ArrowRight size={18} className="arr" /></button>
              <a className="btn btn--ghost-d" href={whatsappUrl()} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { source: "cta" })}><MessageCircle size={18} /> Chat WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
