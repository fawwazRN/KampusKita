import { ArrowRight, Download, MessageCircle } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import flyer from "../assets/flyer.webp";
import { useCountUp, useInView } from "../lib/hooks";
import { site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

const rp = (n) => "Rp" + n.toLocaleString("id-ID");

export default function Biaya({ onRegister }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const a = useCountUp(550000, { run: seen, duration: 1600 });
  const c = useCountUp(1950000, { run: seen, duration: 2000 });
  return (
    <section id="biaya" className="biaya" data-tone="dark">
      <div className="wrap biaya__grid">
        <div className="biaya__copy">
          <Reveal><p className="eyebrow">05 · Transparan</p></Reveal>
          <Words text={"Biaya jelas,\n*tanpa* kejutan."} className="h-section" />
          <Reveal delay={150}><p className="lead">Rincian yang sama untuk PAI dan PGMI. UKT sudah mencakup ujian semester — semuanya tercetak di struk, tidak ada yang disembunyikan.</p></Reveal>
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

        <div className="desk" ref={ref}>
          <a className="flyer" href="/flyer-pendaftaran-kuliah-islam-abu-dzar-genap-2026-2027.pdf" target="_blank" rel="noreferrer" onClick={() => track("brochure_view", { source: "biaya_preview" })} aria-label="Buka brosur pendaftaran (PDF)">
            <img src={flyer} alt="Flyer pendaftaran Kuliah Islam Abu Dzar semester genap 2026/2027" width="900" height="1125" loading="lazy" decoding="async" />
            <span className="flyer__dl"><Download size={14} /> Brosur PDF</span>
          </a>
          <div className={`receipt${seen ? " is-in" : ""}`}>
            <div className="receipt__in">
              <p className="receipt__brand">KITA · Kuliah Islam Abu Dzar</p>
              <p className="receipt__sub">STRUK BIAYA — GENAP 2026/2027</p>
              <div className="rline" style={{ "--r": 0 }}><div><b>Pendaftaran</b><small>Sekali bayar saat mendaftar</small></div><span className="num">{rp(a)}</span></div>
              <div className="rline" style={{ "--r": 1 }}><div><b>Uang masuk</b><small>Tidak ada uang pangkal</small></div><span className="num rline__free">Rp0</span><em className="stamp">GRATIS</em></div>
              <div className="rline" style={{ "--r": 2 }}><div><b>UKT per semester</b><small>Sudah termasuk ujian semester</small></div><span className="num">{rp(c)}</span></div>
              <div className="rsum" style={{ "--r": 3 }}><span>Berlaku sama untuk</span><b>PAI &amp; PGMI</b></div>
              <div className="barcode" aria-hidden="true">{Array.from({ length: 42 }, (_, i) => <i key={i} style={{ width: `${1 + ((i * 7) % 4)}px` }} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
