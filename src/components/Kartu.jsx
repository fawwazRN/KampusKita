import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import Words from "./Words";
import { getRegistrationUrl } from "../data/site";
import { programs } from "../data/programs";
import { track } from "../lib/track";

export default function Kartu({ onRegister }) {
  const [name, setName] = useState("");
  const [prog, setProg] = useState("pai");
  const card = useRef(null);
  const p = programs.find((x) => x.id === prog) ?? programs[0];
  const shown = name.trim() || "Nama Anda";

  const move = (e) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 22}deg`);
    el.style.setProperty("--rx", `${-y * 16}deg`);
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => {
    const el = card.current;
    if (!el) return;
    ["--ry", "--rx"].forEach((k) => el.style.setProperty(k, "0deg"));
  };

  return (
    <section id="kursi" className="kartu" data-tone="dark">
      <div className="wrap kartu__grid">
        <div className="kartu__copy">
          <Reveal><p className="eyebrow">Satu langkah lagi</p></Reveal>
          <Words text={"Kursi Anda\nsudah *disiapkan.*"} className="h-section" />
          <Reveal delay={120}><p className="lead">Tulis nama Anda dan pilih prodi. Kartu calon mahasiswa ini hanya pratinjau — langkah berikutnya otomatis terisi di formulir.</p></Reveal>
          <Reveal delay={200} className="kartu__form">
            <label htmlFor="kartu-name">Nama Anda</label>
            <input id="kartu-name" className="input kartu__in" value={name} maxLength={38} onChange={(e) => setName(e.target.value)} placeholder="Ketik nama lengkap…" autoComplete="name" />
            <div className="kartu__pick" role="group" aria-label="Pilih program studi">
              {programs.map((x) => (<button key={x.id} type="button" aria-pressed={prog === x.id} className={prog === x.id ? "is-on" : ""} onClick={() => setProg(x.id)}>{x.shortName}</button>))}
            </div>
            <button type="button" className="btn btn--gold" onClick={() => { track("registration_open", { source: "kartu" }); onRegister(prog, name.trim()); }}>Daftar dengan nama ini <ArrowRight size={18} className="arr" /></button>
          </Reveal>
        </div>

        <Reveal variant="scale" className="kartu__stage" delay={100}>
          <div className="idc" ref={card} onPointerMove={move} onPointerLeave={leave}>
            <div className="idc__face">
              <span className="idc__sheen" aria-hidden="true" />
              <span className="idc__arch" aria-hidden="true" />
              <header className="idc__top"><Logo tone="dark" height={34} /><span>Kartu Calon<br />Mahasiswa</span></header>
              <div className="idc__body">
                <p className="idc__name" style={{ fontSize: shown.length > 24 ? "1.15rem" : "1.5rem" }}>{shown}</p>
                <p className="idc__prog">{p.name}</p>
              </div>
              <footer className="idc__foot">
                <p><b>Semester Genap 2026/2027</b><span>Kuliah akhir pekan · online</span></p>
                <span className="idc__qr"><QRCodeSVG value={getRegistrationUrl()} size={64} level="M" bgColor="#ffffff" fgColor="#123C75" title="QR pendaftaran" /></span>
              </footer>
            </div>
          </div>
          <p className="kartu__hint">Gerakkan kursor / sentuh kartu →</p>
        </Reveal>
      </div>
    </section>
  );
}
