import { useRef, useState } from "react";
import { Quote } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import { dosen } from "../data/dosen";

const tones = ["navy", "blue", "lime", "gold", "navy", "blue"];
const tabs = [
  { id: "motto", label: "Motto" },
  { id: "edu", label: "Pendidikan" },
  { id: "exp", label: "Pengalaman" },
  { id: "hope", label: "Pesan" },
];

const initials = (n) => n.replace(/^(Dr\.|Adv\.|Ust\.)\s*/i, "").split(/[\s,]+/).filter((w) => /^[A-Z]/.test(w) && !/\./.test(w)).slice(0, 2).map((w) => w[0]).join("");

function Panel({ d, tone }) {
  const has = { motto: d.motto, edu: d.education?.length, exp: d.highlights?.length, hope: d.hope };
  const avail = tabs.filter((t) => has[t.id]);
  const [tab, setTab] = useState(avail[0]?.id ?? "motto");
  const turn = useRef(0);
  const pick = (id) => { turn.current += 1; setTab(id); };
  return (
    <div className="bk">
      <div className="bk__left">
        <div className="bk__portrait">
          {d.photo ? <img src={d.photo} alt={d.name} loading="lazy" decoding="async" /> : <span className="bk__mono" aria-hidden="true">{initials(d.name)}</span>}
          <svg className="bk__orn" viewBox="0 0 120 150" aria-hidden="true"><path d="M8 150 V60 a52 52 0 0 1 104 0 V150" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M20 150 V62 a40 40 0 0 1 80 0 V150" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" /></svg>
        </div>
        <p className="bk__kicker">Pengampu</p>
        <h3 className="bk__name">{d.name}</h3>
        <p className="bk__exp">{d.expertise}</p>
      </div>
      <div className="bk__right">
        {avail.length ? (
          <>
            <div className="bk__tabs" role="tablist">
              {avail.map((t) => (<button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? "is-on" : ""} onClick={() => pick(t.id)}>{t.label}</button>))}
            </div>
            <div className="bk__page" key={`${tab}-${turn.current}`}>
              {tab === "motto" && (<blockquote className="bk__quote"><Quote size={26} aria-hidden="true" /><p>{d.motto}</p></blockquote>)}
              {tab === "edu" && (<ol className="bk__list bk__list--num">{d.education.map((e) => <li key={e}>{e}</li>)}</ol>)}
              {tab === "exp" && (<ul className="bk__list">{d.highlights.map((e) => <li key={e}>{e}</li>)}</ul>)}
              {tab === "hope" && (<p className={`bk__hope${d.hopeAr ? " is-ar" : ""}`} lang={d.hopeAr ? "ar" : undefined} dir={d.hopeAr ? "rtl" : undefined}>{d.hope}</p>)}
            </div>
          </>
        ) : (
          <div className="bk__soon"><p>Profil lengkap sedang disiapkan.</p><small>Tim kampus akan menambahkan pendidikan, pengalaman, dan pesan untuk mahasiswa.</small></div>
        )}
      </div>
    </div>
  );
}

export default function Dosen() {
  const [open, setOpen] = useState(1);
  return (
    <section id="dosen" className="dosen" data-tone="light">
      <div className="wrap">
        <header className="dosen__head">
          <Reveal><p className="eyebrow">07 · Pengajar</p></Reveal>
          <Words text={"Setiap ilmu punya\n*guru* yang menjaganya."} className="h-section" />
          <Reveal delay={150}><p className="lead">Pilih satu buku di rak. Buka halamannya untuk mengenal motto, pendidikan, dan pengalaman pengajar.</p></Reveal>
        </header>
        <Reveal variant="rise" className="shelf">
          <ul className="spines">
            {dosen.map((d, i) => {
              const on = open === i;
              return (
                <li key={d.id} className={`spine spine--${tones[i]}${on ? " is-open" : ""}`}>
                  <button type="button" className="spine__btn" aria-expanded={on} aria-label={`${d.name} — ${d.expertise}`} onClick={() => setOpen(i)}>
                    <span className="spine__no num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="spine__sub">{d.expertise}</span>
                  </button>
                  <div className="spine__panel" aria-hidden={!on} inert={!on}>
                    {on ? <Panel d={d} tone={tones[i]} /> : null}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shelf__board" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}
