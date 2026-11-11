import { useState } from "react";
import Words from "./Words";
import Reveal from "./Reveal";
import { dosen } from "../data/dosen";

const tones = ["navy", "blue", "lime", "gold", "navy", "blue"];

export default function Dosen() {
  const [open, setOpen] = useState(0);
  return (
    <section id="dosen" className="dosen" data-tone="light">
      <div className="wrap">
        <header className="dosen__head">
          <Reveal><p className="eyebrow">07 · Pengajar</p></Reveal>
          <Words text={"Setiap ilmu punya\n*guru* yang menjaganya."} className="h-section" />
          <Reveal delay={150}><p className="lead">Pilih satu buku di rak untuk mengenal pengajar dan bidang yang diampu.</p></Reveal>
        </header>
        <Reveal variant="rise" className="shelf">
          <ul className="spines">
            {dosen.map((d, i) => (
              <li key={d.id} className={`spine spine--${tones[i]}${open === i ? " is-open" : ""}`} onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(i)}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(i)} onFocus={() => setOpen(i)}>
                  <span className="spine__no num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="spine__sub">{d.expertise}</span>
                  <span className="spine__open">
                    <small>Pengampu</small>
                    <b>{d.name}</b>
                    <em>{d.expertise}</em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="shelf__board" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}
