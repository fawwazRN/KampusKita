const ticks = Array.from({ length: 60 }, (_, i) => i);

/* Jam analog statis. Jarum digerakkan oleh variabel CSS --h dan --m (derajat)
   yang ditulis elemen induk saat scroll -> tidak ada render ulang React. */
export default function Clock({ ticking = false, className = "", label = "Jam dinding" }) {
  return (
    <svg className={`clock ${className}`} viewBox="0 -70 520 600" role="img" aria-label={label}>
      <defs>
        <linearGradient id="clk-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e5a9f" />
          <stop offset="1" stopColor="#0b2a55" />
        </linearGradient>
        <radialGradient id="clk-face" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#ece5d4" />
        </radialGradient>
        <radialGradient id="clk-shade" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#020b1a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#020b1a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="260" cy="515" rx="215" ry="30" fill="url(#clk-shade)" />
      <circle cx="260" cy="260" r="250" fill="url(#clk-body)" />
      <circle cx="260" cy="260" r="242" fill="none" stroke="#f2c14e" strokeWidth="5" />
      <circle cx="260" cy="260" r="224" fill="url(#clk-face)" />
      <circle cx="260" cy="260" r="214" fill="none" stroke="#123c75" strokeOpacity="0.12" strokeWidth="1.5" />

      {ticks.map((i) => {
        const major = i % 5 === 0;
        return (
          <line
            key={i}
            x1="260"
            y1={major ? 62 : 66}
            x2="260"
            y2={major ? 84 : 74}
            stroke="#123c75"
            strokeOpacity={major ? 1 : 0.45}
            strokeWidth={major ? 5 : 2}
            strokeLinecap="round"
            transform={`rotate(${i * 6} 260 260)`}
          />
        );
      })}
      {[
        ["12", 260, 138],
        ["3", 384, 273],
        ["6", 260, 410],
        ["9", 136, 273],
      ].map(([t, x, y]) => (
        <text key={t} x={x} y={y} textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="800" fontSize="40" fill="#123c75">
          {t}
        </text>
      ))}
      <text x="260" y="196" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="800" fontSize="15" letterSpacing="7" fill="#a56d18">
        KITA
      </text>

      {/* hands */}
      <g className="clock__hand clock__hand--h">
        <line x1="260" y1="276" x2="260" y2="172" stroke="#123c75" strokeWidth="15" strokeLinecap="round" />
      </g>
      <g className="clock__hand clock__hand--m">
        <line x1="260" y1="282" x2="260" y2="104" stroke="#123c75" strokeWidth="9" strokeLinecap="round" />
      </g>
      <g className={`clock__sec${ticking ? " is-on" : ""}`}>
        <line x1="260" y1="296" x2="260" y2="86" stroke="#d4a232" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="260" cy="296" r="6" fill="#d4a232" />
      </g>
      <circle cx="260" cy="260" r="15" fill="#f2c14e" stroke="#123c75" strokeWidth="4" />
      <circle cx="260" cy="260" r="5" fill="#123c75" />

      {/* topi toga di atas jam */}
      <g className="clock__cap">
        <g transform="translate(260 -22) rotate(-5)">
          <path d="M-52 18 V58 Q0 90 52 58 V18 L0 40 Z" fill="#d4a232" />
          <path d="M0 -42 L112 -4 L0 36 L-112 -4 Z" fill="#f2c14e" />
          <path d="M0 -42 L112 -4 L0 36 Z" fill="#fff" fillOpacity="0.12" />
          <path d="M96 1 V46" stroke="#d4a232" strokeWidth="4" strokeLinecap="round" />
          <circle cx="96" cy="52" r="7" fill="#d4a232" />
          <circle cx="0" cy="-2" r="6" fill="#d4a232" />
        </g>
      </g>
    </svg>
  );
}
