import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Check, ClipboardList, Copy, CreditCard, GraduationCap, MessageCircle, ShieldCheck } from "lucide-react";
import Words from "./Words";
import Reveal from "./Reveal";
import { useScrollPhases } from "../lib/hooks";
import { getRegistrationUrl, site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

const steps = [
  { icon: ClipboardList, t: "Isi formulir", d: "Pilih prodi PAI atau PGMI, lalu lengkapi data diri Anda." },
  { icon: CreditCard, t: "Transfer biaya", d: "Bayar biaya pendaftaran Rp550.000 ke rekening resmi kampus." },
  { icon: ShieldCheck, t: "Verifikasi", d: "Kirim bukti transfer ke WhatsApp untuk diverifikasi tim admisi." },
  { icon: GraduationCap, t: "Mulai kuliah", d: "Ikuti informasi kelas dan mulai perkuliahan semester genap." },
];

export default function Daftar({ onRegister }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  useScrollPhases(ref, { mode: "pass", start: 0.28, end: 0.62 });
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.bank.account); setCopied(true); setTimeout(() => setCopied(false), 1800); track("bank_copy", { bank: site.bank.name }); } catch { setCopied(false); }
  };
  return (
    <section id="cara-daftar" className="daftar" data-tone="light" ref={ref}>
      <div className="wrap daftar__grid">
        <div className="daftar__side">
          <Reveal><p className="eyebrow">06 · Langkah</p></Reveal>
          <Words text={"Empat langkah,\n*mulai* kuliah."} className="h-section" />
          <Reveal delay={150}><p className="lead">Dari formulir hingga kelas pertama — ringkas dan dipandu tim admisi.</p></Reveal>
          <Reveal delay={250} variant="scale" className="qr">
            <QRCodeSVG value={getRegistrationUrl()} size={170} level="M" bgColor="#ffffff" fgColor="#123C75" title="QR pendaftaran Kuliah Islam Abu Dzar" />
            <p><b>Scan &amp; daftar</b><span>Arahkan kamera ponsel untuk membuka formulir.</span></p>
          </Reveal>
        </div>
        <ol className="path">
          <span className="path__line" aria-hidden="true"><span /></span>
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.t} className="pstep" style={{ "--k": i }}>
                <span className="pstep__node"><Icon size={20} strokeWidth={2.2} /></span>
                <Reveal className="pstep__card" variant="right">
                  <span className="pstep__n num">0{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  {i === 0 ? <button type="button" className="btn btn--navy btn--sm" onClick={() => { track("registration_open", { source: "alur" }); onRegister(); }}>Isi formulir <ArrowRight size={15} className="arr" /></button> : null}
                  {i === 1 ? <button type="button" className="copy" onClick={copy} aria-label="Salin nomor rekening"><span className="num">{site.bank.name} {site.bank.account}</span>{copied ? <Check size={15} /> : <Copy size={15} />}<em>{copied ? "Tersalin" : "Salin"}</em></button> : null}
                  {i === 2 ? <a className="btn btn--lime btn--sm" target="_blank" rel="noreferrer" href={whatsappUrl(`Assalamu'alaikum, saya sudah transfer biaya pendaftaran Rp550.000 ke ${site.bank.name} ${site.bank.account} a/n ${site.bank.holder}. Berikut bukti transfernya.`)} onClick={() => track("whatsapp_click", { source: "alur" })}><MessageCircle size={15} /> Kirim bukti</a> : null}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
