import { useRef } from "react";
import { ArrowUp, ArrowUpRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import { InstagramIcon, YoutubeIcon } from "./Icons";
import { useScrollPhases } from "../lib/hooks";
import { mapsEmbedUrl, mapsLink, site, whatsappUrl } from "../data/site";
import { track } from "../lib/track";

const words = ["Kuliah Islam Terbuka", "Akhir Pekan", "Online", "PAI", "PGMI", "Untuk Semua Kalangan"];
const Row = () => (<>{words.map((w) => (<span key={w}>{w}<i aria-hidden="true">✦</i></span>))}</>);

export default function Footer() {
  const ref = useRef(null);
  useScrollPhases(ref, { mode: "enter", phases: { mq: [0, 0.5], big: [0.45, 1] } });
  const contacts = [
    { icon: Phone, label: "WhatsApp", value: site.phoneDisplay, href: whatsappUrl(), ext: true },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: InstagramIcon, label: "Instagram", value: site.social.instagramHandle, href: site.social.instagram, ext: true },
    { icon: YoutubeIcon, label: "YouTube", value: site.social.youtubeLabel, href: site.social.youtube, ext: true },
  ];
  return (
    <footer id="kontak" ref={ref} className="foot" data-tone="dark">
      <div className="mq" aria-hidden="true">
        <div className="mq__row mq__row--a"><Row /><Row /><Row /></div>
        <div className="mq__row mq__row--b"><Row /><Row /><Row /></div>
      </div>

      <div className="wrap foot__grid">
        <Reveal className="foot__map">
          <iframe src={mapsEmbedUrl} title="Peta lokasi Kuliah Islam Abu Dzar, Ciputat, Tangerang Selatan" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          <div className="foot__addr"><MapPin size={17} /><p>{site.address}</p><a href={mapsLink} target="_blank" rel="noreferrer">Buka Maps <ExternalLink size={13} /></a></div>
        </Reveal>
        <Reveal delay={120} className="foot__info">
          <div className="foot__brand"><Logo tone="dark" height={52} /><p><b>{site.name}</b><span>{site.tagline}</span></p></div>
          <div className="foot__contacts">
            {contacts.map((c) => { const I = c.icon; return (
              <a key={c.label} href={c.href} {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})} onClick={() => c.label === "WhatsApp" && track("whatsapp_click", { source: "footer" })}>
                <span className="ico"><I size={17} /></span><span><small>{c.label}</small><b>{c.value}</b></span><ArrowUpRight size={15} />
              </a>); })}
          </div>
          <nav className="foot__nav" aria-label="Tautan footer">
            {site.nav.map((n) => (<a key={n.href} href={n.href} {...(n.newTab ? { target: "_blank", rel: "noopener noreferrer", onClick: () => track("portal_kita_click", { source: "footer" }) } : {})}>{n.label}{n.newTab ? <ExternalLink size={11} /> : null}</a>))}
          </nav>
        </Reveal>
      </div>

      <div className="foot__big" aria-hidden="true">{["K", "I", "T", "A"].map((l, k) => (<span key={l} style={{ "--k": k }}>{l}</span>))}</div>

      <div className="wrap foot__base">
        <p>© 2026 {site.name}. Dikelola oleh {site.manager}.</p>
        <button type="button" className="foot__up" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Kembali ke awal <ArrowUp size={15} /></button>
      </div>
    </footer>
  );
}
