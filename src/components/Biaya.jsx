import { useRef, useState } from "react";
import { ArrowRight, Download, MessageCircle } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import flyer from "../assets/flyer.webp";
import { clamp01, useScrollPhases } from "../lib/hooks";
import { site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

const rp = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const REG = 550000;
const UKT = 1950000;

export default function Biaya({ onRegister }) {
  const desk = useRef(null);
  const [sem, setSem] = useState(4);

  /* struk tercetak & angka naik MENGIKUTI scroll */
  useScrollPhases(desk, {
    mode: "pass",
    phases: { print: [0.22, 0.52], stamp: [0.5, 0.58] },
    onProgress: (p, el) => {
      const t = clamp01((p - 0.22) / 0.3);
      const e = 1 - Math.pow(1 - t, 3);
      const a = el.querySelector("[data-c1]");
      const c = el.querySelector("[data-c3]");
      if (a) a.textContent = rp(REG * e);
      if (c) c.textContent = rp(UKT * e);
    },
  });

  return (
    <section id="biaya" className="biaya" data-tone="dark">
      <div className="wrap biaya__grid">
        <div className="biaya__copy">
          <Reveal><p className="eyebrow">05 · Transparan</p></Reveal>
          <Words text={"Biaya jelas,\n*tanpa* kejutan."} className="h-section" />
          <Reveal delay={150}><p className="lead">Rincian yang sama untuk PAI dan PGMI. UKT sudah mencakup ujian semester — semuanya tercetak di struk, tidak ada yang disembunyikan.</p></Reveal>

          <Reveal delay={200} className="sim">
            <p className="sim__l">Simulasi cepat</p>
            <label htmlFor="sim-range" className="sim__q">Kalau Anda kuliah sampai <b className="num">semester {sem}</b>…</label>
            <input id="sim-range" type="range" min="1" max="8" value={sem} onChange={(e) => setSem(Number(e.target.value))} style={{ "--v": ((sem - 1) / 7) * 100 + "%" }} />
            <div className="sim__out"><span>Total UKT + pendaftaran</span><b className="num">{rp(REG + UKT * sem)}</b></div>
            <small>Hitungan sederhana dari angka di struk (Rp550.000 sekali + Rp1.950.000 × semester). Ketentuan resmi mengikuti kampus.</small>
          </Reveal>

          <Reveal delay={250} className="bank">
            <p className="bank__l">Rekening resmi</p>
            <p className="bank__n num">{site.bank.name} {site.bank.account}</p>
            <p className="bank__h">a/n {site.bank.holder}</p>
            <p className="bank__w">Pembayaran hanya melalui rekening resmi ini. Simpan bukti transfer untuk verifikasi tim admisi.</p>
            <div className="bank__act">
              <button type="button" className="btn btn--gold btn--sm" onClick={() => { track("registration_open", { source: "biaya" }); onRegister(); }}>Daftar Sekarang <ArrowRight size={15} className="arr" /></button>
              <a className="btn btn--ghost-d btn--sm" target="_blank" rel="noreferrer" href={whatsappUrl("Assalamu'alaikum, saya ingin konfirmasi pembayaran biaya pendaftaran Kuliah Islam Abu Dzar.")} onClick={() => track("whatsapp_click", { source: "biaya_bank" })}><MessageCircle size={15} /> Konfirmasi bukti</a>
            </div>
          </Reveal>
        </div>

        <div className="desk" ref={desk}>
          <a className="flyer" href="/flyer-pendaftaran-kuliah-islam-abu-dzar-genap-2026-2027.pdf" target="_blank" rel="noreferrer" onClick={() => track("brochure_view", { source: "biaya_preview" })} aria-label="Buka brosur pendaftaran (PDF)">
            <img src={flyer} alt="Flyer pendaftaran Kuliah Islam Abu Dzar semester genap 2026/2027" width="800" height="1000" loading="lazy" decoding="async" />
            <span className="flyer__dl"><Download size={14} /> Brosur PDF</span>
          </a>
          <div className="receipt">
            <div className="receipt__slot" aria-hidden="true" />
            <div className="receipt__in">
              <p className="receipt__brand">KITA · Kuliah Islam Abu Dzar</p>
              <p className="receipt__sub">STRUK BIAYA — GENAP 2026/2027</p>
              <div className="rline"><div><b>Pendaftaran</b><small>Sekali bayar saat mendaftar</small></div><span className="num" data-c1>Rp0</span></div>
              <div className="rline"><div><b>Uang masuk</b><small>Tidak ada uang pangkal</small></div><span className="num rline__free">Rp0</span><em className="stamp">GRATIS</em></div>
              <div className="rline"><div><b>UKT per semester</b><small>Sudah termasuk ujian semester</small></div><span className="num" data-c3>Rp0</span></div>
              <div className="rsum"><span>Berlaku sama untuk</span><b>PAI &amp; PGMI</b></div>
              <div className="barcode" aria-hidden="true">{Array.from({ length: 42 }, (_, i) => <i key={i} style={{ width: `${1 + ((i * 7) % 4)}px` }} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
