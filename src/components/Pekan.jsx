import { useRef } from "react";
import { BadgeCheck, BookOpen, Briefcase, CalendarDays, ExternalLink, MonitorPlay, ShieldCheck } from "lucide-react";
import { useReducedMotion, useScrollPhases } from "../lib/hooks";

const PHASES = {
  fill: [0.05, 0.27],
  aOut: [0.27, 0.32],
  wake: [0.29, 0.44],
  bIn: [0.4, 0.47],
  bOut: [0.64, 0.69],
  cIn: [0.68, 0.75],
  feat: [0.7, 0.92],
  sun: [0.29, 0.62],
};

const days = [
  { s: "Sen", l: "Senin" },
  { s: "Sel", l: "Selasa" },
  { s: "Rab", l: "Rabu" },
  { s: "Kam", l: "Kamis" },
  { s: "Jum", l: "Jumat" },
  { s: "Sab", l: "Sabtu", rest: true },
  { s: "Ahd", l: "Ahad", rest: true },
];

const features = [
  { icon: MonitorPlay, title: "Online via Google Meet & Classroom", text: "Kuliah dari mana saja: kelas daring terarah, materi digital, dan diskusi bersama dosen." },
  { icon: CalendarDays, title: "Kuliah akhir pekan", text: "Jadwal Sabtu–Ahad dirancang selaras dengan pekerjaan, keluarga, dan aktivitas lain." },
  { icon: BadgeCheck, title: "Status dapat diverifikasi", text: "Gelar S.Pd. dengan kurikulum OBE. Status program dapat dicek melalui PDDIKTI.", link: true },
];

export default function Pekan() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useScrollPhases(ref, {
    mode: "pin",
    phases: PHASES,
    onProgress: (p) => {
      const el = ref.current;
      if (!el) return;
      const next = p > 0.4 ? "light" : "dark";
      if (el.getAttribute("data-tone") !== next) el.setAttribute("data-tone", next);
    },
  });

  return (
    <section id="solusi" ref={ref} className={`pekan${reduced ? " is-static" : ""}`} data-tone="dark" aria-label="Solusi: kuliah di akhir pekan">
      <div className="pekan__stage">
        <div className="pekan__night" aria-hidden="true" />
        <div className="pekan__dawn" aria-hidden="true" />
        <div className="pekan__sun" aria-hidden="true" />

        <div className="wrap pekan__inner">
          <div className="pekan__copy">
            <article className="msg msg--a">
              <p className="eyebrow">02 · Pekan Anda</p>
              <h2 className="h-section">
                Senin sampai Jumat, jam kerja sudah mengambil hampir seluruh waktu Anda.
              </h2>
              <p className="lead">Rapat, laporan, deadline, lembur, macet. Wajar bila kuliah terasa mustahil.</p>
            </article>

            <article className="msg msg--b">
              <p className="eyebrow">Sabtu &amp; Ahad</p>
              <h2 className="h-section">
                Tetapi akhir pekan, itu <span className="mark">milik Anda.</span>
              </h2>
              <p className="lead">Kuliah KITA berlangsung online di akhir pekan — jam kerja Anda tetap aman.</p>
              <p className="msg__badge">
                <ShieldCheck size={16} strokeWidth={2.6} aria-hidden="true" /> Jam kerja tetap aman
              </p>
            </article>

            <article className="msg msg--c">
              <p className="eyebrow">Sistem Kuliah &amp; Legalitas</p>
              <h2 className="h-section">Fleksibel, tapi tetap terukur.</h2>
              <ul className="feat">
                {features.map((f, k) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.title} style={{ "--k": k }}>
                      <span className="ico feat__ico">
                        <Icon size={20} strokeWidth={2.2} />
                      </span>
                      <div>
                        <h3>{f.title}</h3>
                        <p>
                          {f.text}
                          {f.link ? (
                            <>
                              {" "}
                              <a href="https://pddikti.kemdiktisaintek.go.id/" target="_blank" rel="noreferrer">
                                Cek PDDIKTI <ExternalLink size={12} aria-hidden="true" />
                              </a>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>
          </div>

          <div className="board" role="img" aria-label="Papan satu pekan: Senin sampai Jumat terisi kerja, Sabtu dan Ahad untuk kuliah">
            <div className="board__head">
              <span>Satu pekan Anda</span>
              <span className="board__state">
                <i className="board__state-a">Jam kerja</i>
                <i className="board__state-b">Waktu kuliah</i>
              </span>
            </div>
            <ol className="days">
              {days.map((d, i) => (
                <li key={d.s} className={`day ${d.rest ? "day--rest" : "day--work"}`} style={{ "--i": i }}>
                  <span className="day__s">{d.s}</span>
                  <span className="day__card">
                    <span className="day__fill" />
                    <span className="day__ico day__ico--work">
                      <Briefcase size={20} strokeWidth={2.2} />
                    </span>
                    <span className="day__ico day__ico--rest">
                      <BookOpen size={20} strokeWidth={2.2} />
                    </span>
                    <span className="day__t">{d.rest ? "Kuliah" : "Kerja"}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="board__legend">
              <span><i className="lg lg--work" />Kerja</span>
              <span><i className="lg lg--rest" />Kuliah KITA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
