import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, MessageCircle } from "lucide-react";
import Clock from "./Clock";
import Words from "./Words";
import Reveal from "./Reveal";
import { useScrollPhases } from "../lib/hooks";
import { getRegistrationUrl, site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

export default function Fajar({ onRegister }) {
  const ref = useRef(null);
  useScrollPhases(ref, { mode: "pass", start: 0.1, end: 0.55, phases: { rise: [0, 1] } });
  return (
    <section id="mulai" ref={ref} className="fajar" data-tone="dark">
      <div className="fajar__sky" aria-hidden="true" />
      <div className="fajar__sun" aria-hidden="true" />
      <span className="fajar__ar" aria-hidden="true" lang="ar">اقْرَأْ</span>
      <div className="wrap fajar__in">
        <div className="fajar__clock" aria-hidden="true"><Clock minutes={8 * 60} ticking /></div>
        <div className="fajar__copy">
          <Reveal><p className="eyebrow">10 · Sabtu pagi, 08.00</p></Reveal>
          <Words text={"Kelas dibuka.\n*Anda* di mana?"} className="h-display fajar__h" />
          <Reveal delay={200}><p className="lead">Pendaftaran semester genap 2026/2027 sudah dibuka. Konsultasi gratis via WhatsApp <b>{site.phoneDisplay}</b>. Tim admisi membantu memilih prodi, menjelaskan biaya, dan memandu pendaftaran.</p></Reveal>
          <Reveal delay={300} className="fajar__act">
            <button type="button" className="btn btn--gold" onClick={() => { track("registration_open", { source: "cta" }); onRegister(); }}>Daftar Sekarang <ArrowRight size={18} className="arr" /></button>
            <a className="btn btn--ghost-d" href={whatsappUrl()} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { source: "cta" })}><MessageCircle size={18} /> Chat WhatsApp</a>
          </Reveal>
          <Reveal delay={380} className="fajar__pay"><span>Transfer pendaftaran</span><b className="num">{site.bank.name} {site.bank.account}</b><span>a/n {site.bank.holder}</span></Reveal>
        </div>
        <Reveal variant="scale" delay={200} className="fajar__qr">
          <QRCodeSVG value={getRegistrationUrl()} size={150} level="M" bgColor="#ffffff" fgColor="#123C75" title="QR pendaftaran" />
          <span>Scan untuk daftar</span>
        </Reveal>
      </div>
    </section>
  );
}
